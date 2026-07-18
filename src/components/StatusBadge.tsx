interface StatusBadgeProps {
    status: "PENDING" | "DONE" | "RESOLVED";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        PENDING: "bg-signal/10 text-signal border-signal/30",
        DONE: "bg-cyan/10 text-cyan border-cyan/30",
        RESOLVED: "bg-okgreen/10 text-okgreen border-okgreen/30",
    } as const;

    return (
        <span
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase ${styles[status]}`}
        >
            {status}
        </span>
    );
}