// components/ReferralTable.js
import React from 'react';

const dummyData = [
  {
    totalReferrals: 0,
    totalEarnings: '0.00$',
    pendingReferrals: 0,
    clicks: 0,
    conversion: '0%',
  },
  {
    totalReferrals: 0,
    totalEarnings: '0.00$',
    pendingReferrals: 0,
    clicks: 0,
    conversion: '0%',
  },
  {
    totalReferrals: 0,
    totalEarnings: '0.00$',
    pendingReferrals: 0,
    clicks: 0,
    conversion: '+2%',
  },
  {
    totalReferrals: 0,
    totalEarnings: '0.00$',
    pendingReferrals: 0,
    clicks: 0,
    conversion: '0%',
  },
];

export default function AffiliateTable() {
  return (
    <div className="overflow-x-auto mt-4 bg-cardBg">
      <table className="w-full text-left text-sm text-cardTitle">
        <thead className="bg-grayTableRow text-xs uppercase text-cardTitle">
          <tr>
            <th className="px-6 py-3">Total Referrals</th>
            <th className="px-6 py-3">Total Earnings</th>
            <th className="px-6 py-3">Pending Referrals</th>
            <th className="px-6 py-3">Clicks</th>
            <th className="px-6 py-3">Conversion</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((row, index) => (
            <tr
              key={index}
              className={`border-b ${
                index % 2 === 0 ? 'bg-whiteTableRow' : 'bg-grayTableRow'
              }`}
            >
              <td className="px-6 py-4">{row.totalReferrals}</td>
              <td className="px-6 py-4">{row.totalEarnings}</td>
              <td className="px-6 py-4">{row.pendingReferrals}</td>
              <td className="px-6 py-4">{row.clicks}</td>
              <td
                className={`px-6 py-4 ${
                  row.conversion.includes('+')
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {row.conversion}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
