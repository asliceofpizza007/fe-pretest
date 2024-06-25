import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CustomInputNumber from "./CustomInputNumber";

describe("CustomInputNumber", () => {
  const testId = "custom-input-number";
  it("render correctly", () => {
    render(<CustomInputNumber data-testid={testId} value={10} />);

    const el = screen.getByTestId(testId);
    const decBtn = screen.getByText("-");
    const incBtn = screen.getByText("+");

    expect(el).toBeInTheDocument();
    expect(decBtn).toBeInTheDocument();
    expect(incBtn).toBeInTheDocument();
  });

  it("calls onChange wether inc/dec button is clicked", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<CustomInputNumber name="input" onChange={onChange} />);
    const incBtn = screen.getByText("+");
    const decBtn = screen.getByText("-");

    await user.click(incBtn);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "input", value: "1" }),
      })
    );
    await user.click(decBtn);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "input", value: "0" }),
      })
    );
  });

  it("calls onBlur when input is blurred", () => {
    const onBlur = jest.fn();
    render(<CustomInputNumber name="input" value={10} onBlur={onBlur} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "input", value: "10" }),
      })
    );
  });

  it("should not trigger onChange when the value hit max", async () => {
    const max = 10;
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<CustomInputNumber value={max} max={max} onChange={onChange} />);
    const incBtn = screen.getByText("+");

    await user.click(incBtn);
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it("should not trigger onChange when the value hit min", async () => {
    const min = 10;
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<CustomInputNumber value={min} min={min} onChange={onChange} />);
    const decBtn = screen.getByText("-");

    await user.click(decBtn);
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it("should work correctly when step prop changes", async () => {
    const step = 2;
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<CustomInputNumber step={step} onChange={onChange} />);

    const incBtn = screen.getByText("+");
    const decBtn = screen.getByText("-");

    await user.click(incBtn);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: `${step}` }),
      })
    );

    await user.click(decBtn);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "0" }),
      })
    );
  });
});
