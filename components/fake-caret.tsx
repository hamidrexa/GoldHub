export function FakeCaret() {
    return (
        <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-px bg-black" />
        </div>
    );
}
