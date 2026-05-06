"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  TextInput,
  Textarea,
  Select,
  Spinner,
  Alert,
} from "flowbite-react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiPlus,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import { useAuthStore } from "../../store/useAuthStore";
import { apiFetch } from "../../utils/api";
import { useAppointmentStore } from "../../store/useAppointmentStore";

const UpcommingCalendar = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sync } = useAppointmentStore();

  // 🛡️ Live Data from Dexie
  const appointments = useLiveQuery(async () => {
    const all = await db.appointments
      .where("start_time")
      .aboveOrEqual(new Date().toISOString())
      .toArray();
    return all.sort((a, b) => a.start_time.localeCompare(b.start_time)).slice(0, 5);
  }, []);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    status: "SCHEDULED",
    customer: "", // This will hold the customer ID (Related Lead)
  });

  const existingLeads = useLiveQuery(() => db.customers.toArray());

  const handleSubmit = async () => {
    if (!formData.title || !formData.start_time) {
      setError("Title and Date/Time are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Find the selected customer to send name/phone as fallback if needed by backend
      const selectedLead = existingLeads?.find((l) => l.id === formData.customer);

      const res = await apiFetch("/appointments/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          customer_name: selectedLead?.name || "",
          customer_phone: selectedLead?.phone || "",
          agencyId: (user as any)?.agency?.id,
          branchId: (user as any)?.branch?.id,
        }),
      });

      if (res.ok) {
        const newAppt = await res.json();
        // 🛡️ Optimistic Update: Manually inject into Dexie for instant UI update
        await db.appointments.put(newAppt);
        
        // Background sync to ensure consistency
        sync(true, (user as any)?.branch?.id).catch(console.error);

        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          start_time: "",
          status: "SCHEDULED",
          customer: "",
        });
      } else {
        const errData = await res.json();
        setError(errData.detail || "Failed to create appointment");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-brand-primary/10 text-brand-primary dark:bg-brand-accent/10 dark:text-brand-accent border-brand-primary/20 dark:border-brand-accent/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-500/20 dark:border-gray-500/20";
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString("en-US", { month: "short" }),
      day: d.getDate().toString().padStart(2, "0"),
      time: d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  };

  const inputTheme = {
    field: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 p-2.5 text-sm rounded-sm backdrop-blur-sm bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20",
      },
    },
  };

  return (
    <div className="mt-6">
      <Card className="bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg">
              <HiOutlineCalendar className="h-5 w-5 text-brand-primary dark:text-brand-accent" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Upcoming Appointments
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              size="xs"
              color="none"
              pill
              onClick={() => setShowModal(true)}
              className="text-[10px] font-bold capitalize tracking-wider bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white">
              <HiPlus className="mr-1 h-3 w-3" /> Add
            </Button>
            <Button
              size="xs"
              color="none"
              pill
              onClick={() => navigate("/agency/customers")}
              className="text-[10px] font-bold capitalize tracking-wider">
              View Calendar
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {appointments && appointments.length > 0 ? (
            appointments.map((appt) => {
              const { month, day, time } = formatDate(appt.start_time);
              return (
                <div
                  key={appt.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] hover:bg-white/60 dark:hover:bg-white/[0.05] hover:border-brand-primary/20 transition-all cursor-pointer group shadow-sm">
                  <div className="flex flex-col items-center justify-center min-w-[50px] py-1 bg-white/80 dark:bg-brand-primary/10 rounded-lg shadow-sm border border-gray-100/50 dark:border-white/[0.05] group-hover:scale-105 transition-transform">
                    <span className="text-[10px] font-black tracking-wider text-brand-secondary/80">
                      {month}
                    </span>
                    <span className="text-lg font-black text-gray-900 dark:text-white/90 leading-none">
                      {day}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900/90 dark:text-white/90 truncate">
                      {appt.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-gray-500/80 dark:text-gray-400/80">
                      <HiOutlineClock className="w-3 h-3 text-brand-primary/70 dark:text-brand-accent/70" />
                      <span className="text-[11px] font-medium">{time}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`text-[9px] font-black tracking-wider px-2.5 py-1 rounded-full border ${getStatusStyles(
                        appt.status,
                      )}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-gray-400">
              <HiOutlineCalendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">No upcoming appointments</p>
            </div>
          )}
        </div>
        <div className="p-4 rounded-b-xl"></div>
      </Card>

      {/* Appointment Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size="md"
        theme={{
          content: {
            inner:
              "relative rounded-sm bg-white/95 dark:bg-white/[0.03] backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.1] shadow-2xl flex flex-col",
          },
        }}>
        <ModalHeader className="border-b border-gray-100/50 dark:border-white/[0.05] p-4">
          <span className="text-sm font-black tracking-[0.2em] text-brand-primary dark:text-brand-accent">
            Schedule Appointment
          </span>
        </ModalHeader>
        <ModalBody className="p-6 space-y-4">
          {error && <Alert color="failure">{error}</Alert>}
          <div>
            <Label className="text-[10px] font-bold tracking-widest text-gray-500 block mb-2 uppercase">
              Event Title *
            </Label>
            <TextInput
              placeholder="e.g. Consultation, Fitting..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              theme={inputTheme}
            />
          </div>

          <div>
            <Label className="text-[10px] font-bold tracking-widest text-gray-500 block mb-2 uppercase">
              Related Lead
            </Label>
            <Select
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              theme={inputTheme as any}>
              <option value="" disabled>
                Select a lead
              </option>
              <option value="">No specific lead</option>
              {existingLeads?.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} {lead.phone ? `(${lead.phone})` : ""}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-bold tracking-widest text-gray-500 block mb-2 uppercase">
                Date & Time *
              </Label>
              <TextInput
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                theme={inputTheme}
              />
            </div>
            <div>
              <Label className="text-[10px] font-bold tracking-widest text-gray-500 block mb-2 uppercase">
                Status
              </Label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                theme={inputTheme as any}>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-bold tracking-widest text-gray-500 block mb-2 uppercase">
              Event Description
            </Label>
            <Textarea
              placeholder="Details about the appointment..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white rounded-sm text-sm focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200"
            />
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-gray-100/50 dark:border-white/[0.05] p-4 flex justify-end gap-3">
          <Button
            color="none"
            size="sm"
            onClick={() => setShowModal(false)}
            className="rounded-sm bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white">
            Cancel
          </Button>
          <Button
            color="none"
            size="sm"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="rounded-sm bg-brand-primary text-white hover:bg-brand-primary-dark min-w-[100px]">
            {isSubmitting ? <Spinner size="xs" className="mr-2" /> : "Schedule"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UpcommingCalendar;
