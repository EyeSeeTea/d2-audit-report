import { Future } from "$/domain/entities/generic/Future";
import { CancelableResponse } from "$/types/d2-api";

export type FutureData<D> = Future<Error, D>;

export function apiToFuture<Data>(res: CancelableResponse<Data>): FutureData<Data> {
    return Future.fromComputation((resolve, reject) => {
        res.getData()
            .then(resolve)
            .catch((err: unknown) => {
                if (isAbortError(err)) return;
                if (err instanceof Error) {
                    reject(err);
                } else if (err && typeof err === "object" && "message" in err) {
                    // Handle DHIS2 API error responses with message field
                    const message = String(err.message || "Unknown error");
                    reject(new Error(message));
                } else {
                    console.error("apiToFuture:uncatched", err);
                    reject(new Error("Unknown error"));
                }
            });
        return res.cancel;
    });
}

function isAbortError(err: unknown): boolean {
    if (err instanceof Error && err.name === "AbortError") return true;
    if (typeof DOMException !== "undefined" && err instanceof DOMException && err.name === "AbortError") return true;
    if (err && typeof err === "object" && "message" in err) {
        const msg = String((err as { message: unknown }).message);
        if (msg.toLowerCase().includes("aborted")) return true;
    }
    return false;
}
