import { useRef } from "react";

function OtpInput({ value, onChange, length = 6 }) {
  const inputsRef = useRef([]);

  const handleChange = (index, digit) => {
    const cleaned = digit.replace(/\D/g, "");
    if (!cleaned) {
      const next = value.split("");
      next[index] = "";
      onChange(next.join(""));
      return;
    }

    const next = value.split("");
    next[index] = cleaned[cleaned.length - 1];
    onChange(next.join("").slice(0, length));

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-12 rounded-lg bg-input border border-border text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring/60"
        />
      ))}
    </div>
  );
}

export default OtpInput;