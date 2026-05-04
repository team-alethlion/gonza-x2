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
      customer: "John Doe",
      service: "General Consultation",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      customer: "Jane Smith",
      service: "Installment Review",
      date: "May 15, 2026",
      time: "02:30 PM",
      status: "Pending",
    },
  ];

  return (
    <div className="mt-6">
      {/* "Modal-like" Section Container */}
      {/* dark:bg-white/5 */}
      <Card className="bg-white dark:bg-prussian-blue-900/50 border-gray-100 dark:border-white/5 shadow-xl ">
        {/* Header mimicking ModalHeader */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg ">
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
        <div className="p-4 space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-brand-primary/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white dark:bg-space-indigo-800 shadow-sm group-hover:scale-110 transition-transform">
                    <HiOutlineUser className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {appt.customer}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                      {appt.service}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-brand-primary dark:text-brand-accent">
                    <HiOutlineClock className="h-3 w-3" />
                    <span className="text-[11px] font-black uppercase tracking-tighter">
                      {appt.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {appt.date}
                  </p>
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
