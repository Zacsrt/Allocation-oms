type OrderTypeBadgeProps = {
  orderType: string;
};

export function OrderTypeBadge({ orderType }: OrderTypeBadgeProps) {
  const getOrderTypeClass = (type: string) => {
    if (type === "EMERGENCY") {
      return "bg-red-100 text-red-700";
    }

    if (type === "OVERDUE") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getOrderTypeClass(
        orderType
      )}`}
    >
      {orderType}
    </span>
  );
}
