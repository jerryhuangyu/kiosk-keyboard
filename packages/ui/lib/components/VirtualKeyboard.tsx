import { useStorage, virtualKeyboard } from "@extension/shared";
import { virtualKeyboardStorage } from "@extension/storage";
import { useReducer } from "react";

type KeyboardMode = "english" | "number";

type KeyboardState = {
  mode: KeyboardMode;
  permanentShift: boolean; // layout switch 按鈕切換的永久大小寫
  temporaryShift?: boolean; // Shift 暫時切換
};

type Action =
  | { type: "SWITCH_MODE"; mode: KeyboardMode }
  | { type: "TOGGLE_TEMP_SHIFT" }
  | { type: "TOGGLE_PERMANENT_SHIFT" }
  | { type: "RESET_TEMP_SHIFT" };

function keyboardReducer(state: KeyboardState, action: Action): KeyboardState {
  switch (action.type) {
    case "SWITCH_MODE":
      return { ...state, mode: action.mode, temporaryShift: undefined };
    case "TOGGLE_TEMP_SHIFT":
      return { ...state, temporaryShift: !state.temporaryShift };
    case "TOGGLE_PERMANENT_SHIFT":
      return { ...state, temporaryShift: undefined, permanentShift: !state.permanentShift };
    case "RESET_TEMP_SHIFT":
      return { ...state, temporaryShift: undefined };
    default:
      return state;
  }
}

// 計算實際生效的 shift
const isShiftActive = (state: KeyboardState) => {
  if (state.temporaryShift === undefined) {
    return state.permanentShift; // 如果 temporaryShift 未定義，則只使用 permanentShift
  }
  return state.temporaryShift;
};

type KeyboardKey = {
  char: string;
  value: string;
  minWidth?: string;
  onClick?: () => void;
};

export const VirtualKeyboard = () => {
  const { isActive } = useStorage(virtualKeyboardStorage);
  const [keyboardState, dispatch] = useReducer(keyboardReducer, {
    mode: "english",
    permanentShift: false,
  });

  if (!isActive) return;

  // 永久切換大小寫
  const handleSwitchLayout = () => dispatch({ type: "TOGGLE_PERMANENT_SHIFT" });

  const keyboardLayouts: Record<string, KeyboardKey[][]> = {
    uppercase: [
      [
        { char: "Q", value: "Q" },
        { char: "W", value: "W" },
        { char: "E", value: "E" },
        { char: "R", value: "R" },
        { char: "T", value: "T" },
        { char: "Y", value: "Y" },
        { char: "U", value: "U" },
        { char: "I", value: "I" },
        { char: "O", value: "O" },
        { char: "P", value: "P" },
        { char: "[", value: "[" },
        { char: "]", value: "]" },
        { char: "\\", value: "\\" },
        { char: "Backspace", value: "", minWidth: "140px" },
      ],
      [
        { char: "A", value: "A" },
        { char: "S", value: "S" },
        { char: "D", value: "D" },
        { char: "F", value: "F" },
        { char: "G", value: "G" },
        { char: "H", value: "H" },
        { char: "J", value: "J" },
        { char: "K", value: "K" },
        { char: "L", value: "L" },
        { char: ";", value: ";" },
        { char: "'", value: "'" },
        { char: "Enter", value: "\n", minWidth: "160px" },
      ],
      [
        { char: "Z", value: "Z" },
        { char: "X", value: "X" },
        { char: "C", value: "C" },
        { char: "V", value: "V" },
        { char: "B", value: "B" },
        { char: "N", value: "N" },
        { char: "M", value: "M" },
        { char: ",", value: "," },
        { char: ".", value: "." },
        { char: "/", value: "/" },
        {
          char: "Shift",
          value: "",
          minWidth: "120px",
          onClick: () => dispatch({ type: "TOGGLE_TEMP_SHIFT" }),
        },
      ],
      [
        { char: ".com", value: ".com" },
        { char: "@", value: "@" },
        { char: "Space", value: " ", minWidth: "80%" },
        { char: "X", value: "", onClick: () => virtualKeyboard.clearFocus() },
      ],
    ],
    lowercase: [
      [
        { char: "q", value: "q" },
        { char: "w", value: "w" },
        { char: "e", value: "e" },
        { char: "r", value: "r" },
        { char: "t", value: "t" },
        { char: "y", value: "y" },
        { char: "u", value: "u" },
        { char: "i", value: "i" },
        { char: "o", value: "o" },
        { char: "p", value: "p" },
        { char: "[", value: "[" },
        { char: "]", value: "]" },
        { char: "\\", value: "\\" },
        { char: "Backspace", value: "", minWidth: "140px" },
      ],
      [
        { char: "a", value: "a" },
        { char: "s", value: "s" },
        { char: "d", value: "d" },
        { char: "f", value: "f" },
        { char: "g", value: "g" },
        { char: "h", value: "h" },
        { char: "j", value: "j" },
        { char: "k", value: "k" },
        { char: "l", value: "l" },
        { char: ";", value: ";" },
        { char: "'", value: "'" },
        { char: "Enter", value: "\n", minWidth: "160px" },
      ],
      [
        { char: "z", value: "z" },
        { char: "x", value: "x" },
        { char: "c", value: "c" },
        { char: "v", value: "v" },
        { char: "b", value: "b" },
        { char: "n", value: "n" },
        { char: "m", value: "m" },
        { char: ",", value: "," },
        { char: ".", value: "." },
        { char: "/", value: "/" },
        {
          char: "Shift",
          value: "",
          minWidth: "120px",
          onClick: () => dispatch({ type: "TOGGLE_TEMP_SHIFT" }),
        },
      ],
      [
        { char: ".com", value: ".com" },
        { char: "@", value: "@" },
        { char: "Space", value: " ", minWidth: "80%" },
        { char: "X", value: "", onClick: () => virtualKeyboard.clearFocus() },
      ],
    ],
    lowernumber: [
      [
        { char: "1", value: "1" },
        { char: "2", value: "2" },
        { char: "3", value: "3" },
      ],
      [
        { char: "4", value: "4" },
        { char: "5", value: "5" },
        { char: "6", value: "6" },
      ],
      [
        { char: "7", value: "7" },
        { char: "8", value: "8" },
        { char: "9", value: "9" },
      ],
      [
        { char: "Shift", value: "", onClick: () => dispatch({ type: "TOGGLE_TEMP_SHIFT" }) },
        { char: "0", value: "0" },
        { char: "-", value: "-" },
      ],
      [{ char: "Backspace", value: "" }],
    ],
    uppernumber: [
      [
        { char: "!", value: "!" },
        { char: "/", value: "/" },
        { char: "#", value: "#" },
      ],
      [
        { char: "$", value: "$" },
        { char: "%", value: "%" },
        { char: "^", value: "^" },
      ],
      [
        { char: "&", value: "&" },
        { char: "*", value: "*" },
        { char: "(", value: "(" },
      ],
      [
        { char: "Shift", value: "", onClick: () => dispatch({ type: "TOGGLE_TEMP_SHIFT" }) },
        { char: ")", value: ")" },
        { char: "+", value: "+" },
      ],
      [{ char: "Backspace", value: "" }],
    ],
  };

  // 計算目前使用哪個 layout
  const layoutKey = (() => {
    switch (keyboardState.mode) {
      case "english": {
        if (isShiftActive(keyboardState)) return "uppercase";
        return "lowercase";
      }
      case "number": {
        if (isShiftActive(keyboardState)) return "uppernumber";
        return "lowernumber";
      }
      default:
        return "lowercase";
    }
  })();

  return (
    <div
      id="kiosk-virtual-keyboard"
      className="z-50 mx-auto flex w-fit items-center gap-2 rounded bg-gray-200 px-2 py-1 text-black"
    >
      <div className="flex flex-col gap-2">
        <div className="mb-1 flex flex-row justify-end">
          <button
            type="button"
            className="mr-2 rounded bg-blue-200 px-2 py-1 font-bold text-xs hover:bg-blue-400"
            onClick={handleSwitchLayout}
          >
            {keyboardState.permanentShift ? "切換小寫" : "切換大寫"}
          </button>
        </div>
        {keyboardLayouts[layoutKey].map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row flex-nowrap gap-2">
            {row.map((key) => (
              <KeyButton
                key={key.char}
                label={key.char}
                minWidth={key.minWidth}
                onClick={async () => {
                  if (key.onClick) {
                    key.onClick();
                  } else {
                    await virtualKeyboard.typeCharacter(key.value);
                    // 輸入完單字後重置暫時 Shift
                    dispatch({ type: "RESET_TEMP_SHIFT" });
                  }
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const KeyButton = ({ label, minWidth, onClick }: { label: string; minWidth?: string; onClick?: () => void }) => {
  return (
    <button
      type="button"
      style={{ minWidth }}
      className="key size-12 flex-1 rounded-md bg-gray-50 text-lg hover:bg-gray-300 focus:outline-none sm:size-14 lg:size-16"
      onClick={onClick}
    >
      {label}
    </button>
  );
};
