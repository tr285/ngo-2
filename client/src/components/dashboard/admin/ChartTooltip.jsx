const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {formatter ? formatter(entry.value, entry.name) : `${entry.name}: ${entry.value}`}
        </p>
      ))}
    </div>
  );
};

export default ChartTooltip;
