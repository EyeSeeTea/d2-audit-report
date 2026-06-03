import React from "react";

export function useInterval(intervalTimeMs: number, fn: () => void | { stop: boolean }) {
    React.useEffect(() => {
        const intervalId = setInterval(() => {
            const res = fn();
            if (res && res.stop) window.clearInterval(intervalId);
        }, intervalTimeMs);
        return () => window.clearInterval(intervalId);
    }, [intervalTimeMs, fn]);
}
