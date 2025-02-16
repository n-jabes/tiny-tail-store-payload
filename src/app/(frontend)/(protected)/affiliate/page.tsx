'use client';
import AffiliateTable from '@/components/ui/affiliate/affiliate-table';
import React, { useState } from 'react';
import { User, HandCoins, CreditCard, Wallet } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState('30 days');

  const handleDropdownChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedPeriod(e.target.value);
  };

  return (
    <div className="p-6 mx-auto bg-contentBg mb-4 rounded-lg shadow-sm h-max w-full">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2 text-start">
          <h1 className="text-xl font-semibold text-title mb-2">
            Welcome back, Jhon!
          </h1>
          <p className="text-text">Here’s your overview of your business</p>
        </header>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg flex flex-col justify-between bg-cardBg p-4 shadow">
            <div className="flex align-center w-full justify-between gap-2">
              <h2 className="text-sm text-cardTitle font-semibold">
                Total Referrals
              </h2>
              <div className="bg-cardIconBg rounded-full p-2">
                <User className="text-cardIcon w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-cardNumbers">0</p>
            <p className="text-xs text-text">
              Rewards and commissions received up to this point
            </p>
          </div>

          <div className="rounded-lg flex flex-col justify-between bg-cardHover p-4 shadow">
            <div className="flex align-center w-full justify-between gap-2">
              <h2 className="text-sm text-[#E2E5FF] font-semibold">
                Paid Referrals
              </h2>
              <div className="bg-cardIconBg rounded-full p-2">
                <HandCoins className="text-cardIcon w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#E2E5FF]">0</p>
            <p className="text-xs text-[#E2E5FF]">
              Number of referrals withdrawn up to now
            </p>
          </div>

          <div className="rounded-lg flex flex-col justify-between bg-cardBg p-4 shadow">
            <div className="flex align-center w-full justify-between gap-2">
              <h2 className="text-sm text-cardTitle font-semibold">
                Unpaid Referrals
              </h2>
              <div className="bg-cardIconBg rounded-full p-2">
                <Wallet className="text-cardIcon w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-cardNumbers">0</p>
            <p className="text-xs text-text">
              Referrals that have not yet been withdrawn
            </p>
          </div>

          <div className="rounded-lg flex flex-col justify-between bg-cardBg p-4 shadow">
            <div className="flex align-center w-full justify-between gap-2">
              <h2 className="text-sm text-cardTitle font-semibold">
                Total Payout Payments
              </h2>
              <div className="bg-cardIconBg rounded-full p-2">
                <CreditCard className="text-cardIcon w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-cardNumbers">0</p>
            <p className="text-xs text-text">
              Rewards and commissions received up to this point
            </p>
          </div>

          <div className="rounded-lg flex flex-col justify-between bg-cardBg p-2 shadow gap-2">
            <div className="flex items-center gap-2 p-2 bg-innerCardBg rounded-md">
              <Image width={40} height={40} alt="rise" src="/arrow-down.png" />
              <div className="flex flex-col gap-[1px]">
                <p className="font-semibold text-cardTitle text-[0.9rem]">
                  $200
                </p>
                <p className="text-[0.7rem]">
                  Earnings that have been earned up to this point
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-innerCardBg rounded-md">
              <Image width={40} height={40} alt="rise" src="/arrow-up.png" />
              <div className="flex flex-col gap-[5px]">
                <p className="font-semibold text-cardTitle text-[0.9rem]">
                  $200
                </p>
                <p className="text-[0.7rem]">
                  Earnings that have been earned up to this point
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Overview Section */}
        <section className="rounded-lg bg-cardBg p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-cardTitle">
              Earnings Overview
            </h2>
            <div className='flex gap-2 items-center'>
            <p className='text-text text-sm'>Summary for last: </p>
            <select
              value={selectedPeriod}
              onChange={handleDropdownChange}
              className="rounded border-dropdownBg p-2 text-sm"
            >
              <option value="7 days">7 days</option>
              <option value="30 days">30 days</option>
              <option value="90 days">90 days</option>
            </select>
            </div>
          </div>
          {/* <ReferralTable /> */}
          <AffiliateTable />
          <p className="mt-4 text-sm text-text">
            Discover more about our affiliate program and begin earning
            referrals today.
          </p>
        </section>

        {/* Actions Section */}
        <div className="flex justify-end space-x-4">
          <button className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800">
            Add payout method
          </button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Earn Rewards
          </button>
        </div>
      </div>
    </div>
  );
}
