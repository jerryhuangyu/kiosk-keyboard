import { useStorage, virtualKeyboard } from "@extension/shared";
import { virtualKeyboardStorage } from "@extension/storage";

type KeyboardKey = {
  char: string;
  value: string;
  minWidth?: string;
  onClick?: () => void;
};

const keyboardLayout: KeyboardKey[][] = [
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
    { char: "Shift", value: "", minWidth: "120px" },
  ],
  [
    { char: ".com", value: ".com" },
    { char: "@", value: "@" },
    { char: "Space", value: " ", minWidth: "80%" },
    { char: "X", value: "", onClick: () => virtualKeyboard.clearFocus() },
  ],
];

export const VirtualKeyboard = () => {
  const { isActive } = useStorage(virtualKeyboardStorage);

  if (!isActive) return null;

  return (
    <div
      id="kiosk-virtual-keyboard"
      className="z-50 mx-auto flex w-fit items-center gap-2 rounded bg-gray-200 px-2 py-1 text-black"
    >
      <div className="flex flex-col gap-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row flex-nowrap gap-2">
            {row.map((key) => (
              <KeyButton
                key={key.char}
                label={key.char}
                value={key.value}
                minWidth={key.minWidth}
                onClick={key.onClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const KeyButton = ({
  label,
  value,
  minWidth,
  onClick,
}: {
  label: string;
  value: string;
  minWidth?: string;
  onClick?: () => void;
}) => {
  const handleKeyPress = async (char: string) => {
    await virtualKeyboard.typeCharacter(char);
  };

  return (
    <button
      type="button"
      style={{ minWidth }}
      className="key size-12 flex-1 rounded-md bg-gray-50 text-lg hover:bg-gray-300 focus:outline-none sm:size-14 lg:size-16"
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
        handleKeyPress(value);
      }}
    >
      {label}
    </button>
  );
};
