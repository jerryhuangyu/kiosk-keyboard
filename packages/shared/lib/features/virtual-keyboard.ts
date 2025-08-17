import { virtualKeyboardStorage } from "@extension/storage";

class VirtualKeyboard {
  public async focusInput(element: HTMLInputElement | HTMLTextAreaElement) {
    await virtualKeyboardStorage.focusInput(element);
  }

  public async clearFocus() {
    await virtualKeyboardStorage.clearFocus();
  }

  public async typeCharacter(char: string) {
    const state = await virtualKeyboardStorage.get();
    let element: HTMLInputElement | HTMLTextAreaElement | null = null;

    // Find the active element by ID
    if (state.activeElementId) {
      const foundElement = document.getElementById(state.activeElementId);
      if (foundElement instanceof HTMLInputElement || foundElement instanceof HTMLTextAreaElement) {
        element = foundElement;
      }
    }

    if (!element) {
      console.warn("No active element to type into");
      return;
    }

    // Update input value
    const value = element.value;
    const start = element.selectionStart ?? value.length;
    const end = element.selectionEnd ?? value.length;
    const newValue = value.slice(0, start) + char + value.slice(end);
    element.value = newValue;

    // Update selection range
    const newCursorPos = start + char.length;
    element.focus(); // This is necessary because setSelectionRange only works on focused elements
    const originalType = element.type;
    if (!(element instanceof HTMLTextAreaElement)) {
      element.type = "text";
    }
    element?.setSelectionRange(newCursorPos, newCursorPos);
    if (!(element instanceof HTMLTextAreaElement)) {
      element.type = originalType;
    }

    console.debug("Dispatching input events");
    console.debug(`Current value: "${value}"`);
    console.debug(`Current cursor position: start=${start}, end=${end}`);
    console.debug(`Selected text: "${value.slice(start, end)}"`);
    console.debug(`New value: "${newValue}"`);
    console.debug(`New cursor position: start=${newCursorPos}, end=${newCursorPos}`);

    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: char,
    });
    element.dispatchEvent(inputEvent);
  }

  // public backspace() {
  //     if (!this.activeElement) return;

  //     const element = this.activeElement;
  //     const start = element.selectionStart || 0;
  //     const end = element.selectionEnd || 0;
  //     const value = element.value;

  //     if (start === end && start > 0) {
  //         // Delete single character before cursor
  //         const newValue = value.slice(0, start - 1) + value.slice(start);
  //         element.value = newValue;
  //         element.setSelectionRange(start - 1, start - 1);
  //     } else if (start !== end) {
  //         // Delete selected text
  //         const newValue = value.slice(0, start) + value.slice(end);
  //         element.value = newValue;
  //         element.setSelectionRange(start, start);
  //     }

  //     this.dispatchInputEvents(element, '');
  // }

  // public enter() {
  //     if (!this.activeElement) return;

  //     if (this.activeElement instanceof HTMLTextAreaElement) {
  //         this.typeCharacter('\n');
  //     } else {
  //         // For input elements, trigger form submission or blur
  //         this.activeElement.blur();
  //     }
  // }

  // private dispatchInputEvents(element: HTMLInputElement | HTMLTextAreaElement, data: string) {
  //   // Dispatch input event (modern standard)
  //   const inputEvent = new InputEvent("input", {
  //     bubbles: true,
  //     cancelable: true,
  //     inputType: data ? "insertText" : "deleteContentBackward",
  //     data: data || null,
  //   });
  //   element.dispatchEvent(inputEvent);

  //   // Dispatch change event
  //   const changeEvent = new Event("change", {
  //     bubbles: true,
  //     cancelable: true,
  //   });
  //   element.dispatchEvent(changeEvent);

  //   // For compatibility with older frameworks
  //   const keyboardEvent = new KeyboardEvent("keyup", {
  //     bubbles: true,
  //     cancelable: true,
  //     key: data || "Backspace",
  //   });
  //   element.dispatchEvent(keyboardEvent);

  //   console.log("Input events dispatched for:", data || "backspace");
  // }

  public async isActive(): Promise<boolean> {
    const state = await virtualKeyboardStorage.get();
    console.log("Checking if virtual keyboard is active", state);
    return state.isActive;
  }
}

export const virtualKeyboard = new VirtualKeyboard();
