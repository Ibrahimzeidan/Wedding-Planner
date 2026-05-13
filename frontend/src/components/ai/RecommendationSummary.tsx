"use client";

import { useState } from "react";
import AIGroupBookingFlow from "@/components/ai/AIGroupBookingFlow";
import RecommendationCard from "@/components/ai/RecommendationCard";
import type { AIRecommendationOption, AIRecommendationSummary } from "@/types/ai";

type Props = {
  summary: AIRecommendationSummary | null;
};

function money(value: number) {
  return `$${Number(value).toLocaleString()}`;
}

export default function RecommendationSummary({ summary }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  if (!summary || !summary.items.length) {
    return (
      <aside className="border border-[#111111]/10 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-[#111111]">Recommendations</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Complete wedding packages from your database will appear here.
        </p>
      </aside>
    );
  }
  const options = summary.options?.length ? summary.options : [asOption(summary)];
  const option = options[Math.min(selected, options.length - 1)];
  const selectedSummary = { ...summary, ...option, recommendation_summary: option.difference };

  return (
    <aside className="border border-[#111111]/10 bg-white p-5 shadow-soft">
      <button type="button" onClick={() => setIsOpen((value) => !value)}
        className="w-full border border-[#111111]/10 bg-event-paper p-4 text-left">
        <p className="text-xs font-semibold uppercase text-stone-500">AI Wedding Package</p>
        <h2 className="mt-1 text-lg font-semibold text-[#111111]">
          {option.items.length} services for {money(option.total_estimated_cost)}
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          {option.remaining_budget != null ? `Remaining budget: ${money(option.remaining_budget)}` : "Tap to view providers"}
        </p>
      </button>
      {summary.recommendation_summary && (
        <p className="mt-3 text-sm leading-6 text-stone-600">{summary.recommendation_summary}</p>
      )}
      <div className="mt-4 space-y-2">
        {options.map((item, index) => (
          <button key={item.title} type="button" onClick={() => setSelected(index)}
            className={`w-full border px-3 py-2 text-left text-sm ${selected === index ? "border-[#111111]" : ""}`}>
            <span className="font-semibold">{item.title}: {money(item.total_estimated_cost)}</span>
            <span className="block text-xs text-stone-600">{item.difference}</span>
          </button>
        ))}
      </div>
      <div className="mt-4"><AIGroupBookingFlow summary={selectedSummary} /></div>
      {isOpen && (
        <div className="mt-4 space-y-3">
          {option.items.map((item) => (
            <RecommendationCard key={`${item.category}-${item.package_id}`} item={item} />
          ))}
        </div>
      )}
    </aside>
  );
}

function asOption(summary: AIRecommendationSummary): AIRecommendationOption {
  return {
    title: "Recommended Package 1",
    total_estimated_cost: summary.total_estimated_cost,
    remaining_budget: summary.remaining_budget,
    difference: summary.recommendation_summary || "Best overall match.",
    items: summary.items,
  };
}
