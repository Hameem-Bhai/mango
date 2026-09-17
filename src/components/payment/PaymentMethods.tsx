import React from 'react';

export function PaymentMethods() {
  const methods = [
    { name: 'bKash', color: 'bg-[#E2136E]' },
    { name: 'Nagad', color: 'bg-[#F26522]' },
    { name: 'Rocket', color: 'bg-[#8B008B]' },
    { name: 'Visa', color: 'bg-[#1A1F71]' },
    { name: 'Mastercard', color: 'bg-[#EB001B]' },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {methods.map((method) => (
        <span
          key={method.name}
          className={`${method.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm`}
        >
          {method.name}
        </span>
      ))}
    </div>
  );
}
