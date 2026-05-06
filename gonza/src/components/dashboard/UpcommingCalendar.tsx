"use client";

import React from "react";
import { Button, Card, Badge } from "flowbite-react";
import {
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineClock,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const UpcommingCalendar = () => {
  const navigate = useNavigate();

  // Mock data for upcoming appointments
  const appointments = [
    {
      id: 1,
      month: "May",
      day: "04",
      description: "Sample Description for Appointment",
      time: "12:00 PM",
      status: "Scheduled",
    },
    {
      id: 2,
      month: "May",
      day: "15",
      description: "Installment Review Session",
      time: "02:30 PM",
      status: "Completed",
    },
    {
      id: 3,
      month: "Jun",
      day: "02",
      description: "Initial Product Consultation",
      time: "09:00 AM",
      status: "Cancelled",
    },
  ];

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="mt-6">
      {/* "Modal-like" Section Container */}
      <Card className="bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 shadow-xl">
        {/* Header mimicking ModalHeader */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg">
              <HiOutlineCalendar className="h-5 w-5 text-brand-primary dark:text-brand-accent" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Upcoming Appointments
            </h3>
          </div>
          <Button
            size="xs"
            color="none"
            pill
            onClick={() => navigate("/agency/customers")}
            className="text-[10px] font-bold capitalize tracking-wider">
            View Calendar
          </Button>
        </div>

        {/* Content mimicking ModalBody */}
        <div className="p-4 space-y-3">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] hover:bg-white/60 dark:hover:bg-white/[0.05] hover:border-brand-primary/20 transition-all cursor-pointer group shadow-sm">
                {/* Left: Date Block */}
                <div className="flex flex-col items-center justify-center min-w-[50px] py-1 bg-white/80 dark:bg-brand-primary/10 rounded-lg shadow-sm border border-gray-100/50 dark:border-white/[0.05] group-hover:scale-105 transition-transform">
                  <span className="text-[10px] font-black  tracking-wider text-brand-secondary/80">
                    {appt.month}
                  </span>
                  <span className="text-lg font-black text-gray-900 dark:text-white/90 leading-none">
                    {appt.day}
                  </span>
                </div>

                {/* Center: Info Block */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900/90 dark:text-white/90 truncate">
                    {appt.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-gray-500/80 dark:text-gray-400/80">
                    <HiOutlineClock className="w-3 h-3 text-brand-primary/70 dark:text-brand-accent/70" />
                    <span className="text-[11px] font-medium">{appt.time}</span>
                  </div>
                </div>

                {/* Right: Status Block */}
                <div className="shrink-0">
                  <span
                    className={`text-[9px] font-black  tracking-wider px-2.5 py-1 rounded-full border ${getStatusStyles(
                      appt.status,
                    )}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-400">
              <HiOutlineCalendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Footer mimicking ModalFooter */}
        <div className="p-4   rounded-b-xl  ">{/*  */}</div>
      </Card>
    </div>
  );
};

export default UpcommingCalendar;
