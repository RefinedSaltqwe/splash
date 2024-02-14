import { cn } from "@/lib/utils";
import { type TimesheetField, type TimesheetRowKey } from "@/types";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import { Switch } from "@headlessui/react";
import {
  type BreakIn,
  type BreakOut,
  type TimeIn,
  type TimeOut,
} from "@prisma/client";
import React, { memo, useEffect, useRef, useState } from "react";
import { PatternFormat } from "react-number-format";

type TimeInputProps = {
  rowKey: TimesheetRowKey;
  field: TimesheetField;
  activeTimesheet: TimesheetWithInputTimes;
  onSetTimesheets: (
    timesheetId: string,
    newTimesheet: TimesheetWithInputTimes,
  ) => void;
  timeInput: TimeIn | TimeOut | BreakIn | BreakOut | null;
  theDate: Date;
};

const TimeInput: React.FC<TimeInputProps> = ({
  onSetTimesheets,
  rowKey,
  field,
  activeTimesheet,
  timeInput,
  theDate,
}) => {
  const newTimesheet = activeTimesheet;
  const newTimeInput = timeInput;
  const getFieldValue = timeInput
    ? timeInput[field]
      ? timeInput[field]
      : ""
    : "";
  const removeDateNullish = getFieldValue ?? "";
  const dbTimeArray = removeDateNullish
    .toLocaleString()
    .split(" ")[1]
    ?.split(":");
  const initialTimeValue = dbTimeArray
    ? `${
        parseInt(dbTimeArray[0]!) < 10 ? "0" : ""
      }${`${dbTimeArray[0]!}:${dbTimeArray[1]!}`}`
    : "";

  const finalIsPm = useRef<boolean>(false);
  const firstRender = useRef<boolean>(false);
  const [isPm, setIsPm] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialTimeValue);
  const [finalTime, setFinalTime] = useState<string>(value);

  const timeSplit = value?.split(":");
  const hour = timeSplit[0] ? timeSplit[0] : "";
  const minute = timeSplit[1] ? timeSplit[1] : "";
  const countDashOccurence = (value.match(new RegExp("-", "g")) ?? []).length;

  const _12hrFormat = (hr: number, sub: number, min: string) => {
    const _12hrFormat = hr - sub;
    if (_12hrFormat < 10) {
      return `0${_12hrFormat}:${min}`;
    } else if (_12hrFormat === 12) {
      return `11:59`;
    } else {
      return `${_12hrFormat}:${min}`;
    }
  };

  const _12HourConverter = (
    intHour: number,
    conditionedMinute: string,
    intMinute: number,
  ) => {
    if (intHour <= 12) {
      console.log("in");
      if (intHour === 0 && intMinute >= 0) {
        console.log("in1");
        setValue(`12:${conditionedMinute}`);
        setFinalTime(`12:${conditionedMinute}`);
        setIsPm(true);
        finalIsPm.current = true;
      } else if (minute.includes("-") || (intHour > 0 && intMinute > 0)) {
        console.log("in2", intHour);
        setValue(`${intHour}:${intMinute}`);
        if (intHour === 12 && finalIsPm.current == true && intMinute > 59) {
          console.log("in2.1", intHour);
          setValue(`11:59`);
          setFinalTime(`11:59`);
          setIsPm(true);
          finalIsPm.current = true;
          return;
        } else {
          console.log("in2.3", intHour);
          if (intHour === 12 && finalIsPm.current) {
            setValue(`11:${conditionedMinute}`);
            setFinalTime(`11:${conditionedMinute}`);
            setIsPm(true);
            finalIsPm.current = true;
          } else {
            setValue(`${hour}:${conditionedMinute}`);
            setFinalTime(`${hour}:${conditionedMinute}`);
          }
        }
      } else if (intHour === 12 && finalIsPm.current) {
        console.log("in3", intHour);
        setValue(`11:59`);
        setFinalTime(`11:59`);
      }
    } else if (!Number.isNaN(intHour)) {
      if (intHour > 12 && intHour <= 24) {
        setValue(_12hrFormat(intHour, 12, conditionedMinute));
        setFinalTime(_12hrFormat(intHour, 12, conditionedMinute));
      } else if (intHour > 24 && intHour <= 36) {
        setValue(_12hrFormat(intHour, 24, conditionedMinute));
        setFinalTime(_12hrFormat(intHour, 24, conditionedMinute));
      } else if (intHour > 36 && intHour <= 48) {
        setValue(_12hrFormat(intHour, 36, conditionedMinute));
        setFinalTime(_12hrFormat(intHour, 36, conditionedMinute));
      } else if (intHour > 48 && intHour <= 60) {
        setValue(_12hrFormat(intHour, 48, conditionedMinute));
        setFinalTime(_12hrFormat(intHour, 48, conditionedMinute));
      } else if (intHour > 60 && intHour <= 72) {
        setValue(_12hrFormat(intHour, 60, conditionedMinute));
        setFinalTime(_12hrFormat(intHour, 60, conditionedMinute));
      } else if (intHour > 72 && intHour <= 84) {
        setValue(_12hrFormat(intHour, 72, conditionedMinute));
        setFinalTime(_12hrFormat(intHour, 72, conditionedMinute));
      } else if (intHour > 84 && intHour <= 96) {
        setValue(_12hrFormat(intHour, 84, conditionedMinute));
        setFinalTime(_12hrFormat(intHour, 84, conditionedMinute));
      } else if (intHour > 96) {
        setValue(_12hrFormat(intHour, 96, conditionedMinute));
        setFinalTime(_12hrFormat(intHour, 96, conditionedMinute));
      }
      setIsPm(true);
      finalIsPm.current = true;
    }
  };

  const onInputBlur = () => {
    const intHour = parseInt(hour);
    const intMinute = parseInt(minute);
    console.log(intHour + " === " + intMinute + " == " + finalIsPm.current);
    let conditionedMinute;
    if (intMinute == 0) {
      conditionedMinute = "00";
    } else if (
      intHour !== 12 &&
      intHour !== 24 &&
      intHour !== 36 &&
      intHour !== 48 &&
      intHour !== 60 &&
      intHour !== 72 &&
      intHour !== 84 &&
      intHour !== 96 &&
      intMinute > 0 &&
      intMinute < 10
    ) {
      conditionedMinute = `0${intMinute}`;
    } else if (
      intHour !== 12 &&
      intHour !== 24 &&
      intHour !== 36 &&
      intHour !== 48 &&
      intHour !== 60 &&
      intHour !== 72 &&
      intHour !== 84 &&
      intHour !== 96 &&
      intMinute >= 10 &&
      intMinute < 60
    ) {
      conditionedMinute = `${intMinute}`;
    } else if (intHour == 12 && intMinute >= 0 && finalIsPm.current) {
      conditionedMinute = "59";
    } else if (intHour == 12 && intMinute < 60 && !finalIsPm.current) {
      conditionedMinute = `${intMinute}`;
    } else if (intHour == 12 && intMinute > 59 && !finalIsPm.current) {
      conditionedMinute = `59`;
    } else {
      conditionedMinute = "00";
    }
    // Dash Occurence.
    switch (countDashOccurence) {
      //If user inputs: | ##:#-
      case 1:
        // if 00:0- => 12:00
        if (
          hour.startsWith("0") &&
          hour.endsWith("0") &&
          minute.startsWith("0")
        ) {
          setValue(`12:00`);
          setFinalTime(`12:00`);
        } else {
          // if 02:3- => 02:30
          if (hour.startsWith("0") && !hour.endsWith("0")) {
            setValue(`${hour}:${minute[0]}0`);
            setFinalTime(`${hour}:${minute[0]}0`);
          } else if (
            // if 00:5- => 12:50
            hour.startsWith("0") &&
            hour.endsWith("0") &&
            !minute.startsWith("0")
          ) {
            setValue(`12:${minute[0]}0`);
            setFinalTime(`12:${minute[0]}0`);
          } else {
            const minuteString = `${hour[1]}${minute[0]}`;

            // if 17:4- => 01:74 => 01:00
            if (parseInt(minuteString) > 59) {
              setValue(`0${hour[0]}:00`);
              setFinalTime(`0${hour[0]}:00`);
            } else {
              //if 12:3- => 01:23
              setValue(`0${hour[0]}:${minuteString}`);
              setFinalTime(`0${hour[0]}:${minuteString}`);
            }
          }
        }
        setIsPm(false);
        finalIsPm.current = false;
        break;
      //If user inputs: 12:--
      case 2:
        _12HourConverter(intHour, conditionedMinute, intMinute);
        break;
      //If user inputs: 1-:--
      case 3:
        if (intHour === 0) {
          setValue("12:00");
          setFinalTime(`12:00`);
        } else {
          setValue(`0${hour[0]}:00`);
          setFinalTime(`0${hour[0]}:00`);
        }
        setIsPm(false);
        finalIsPm.current = false;
        12;
        break;
      //If user inputs: --:-- or empty
      case 4:
        setValue("");
        setFinalTime("");
        setIsPm(false);
        finalIsPm.current = false;
        break;
      //If user inputs: 12:30
      default:
        if (intHour === 0 && minute.startsWith("0") && minute.endsWith("0")) {
          setValue("11:59");
          setFinalTime("11:59");
          setIsPm(true);
          finalIsPm.current = true;
        } else {
          console.log("agi");
          _12HourConverter(intHour, conditionedMinute, intMinute);
        }
        break;
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      const time = finalTime ? finalTime.split(":") : null;
      const timer = setTimeout(() => {
        if (newTimesheet && newTimeInput) {
          const dateSplitter = theDate.toString().split(" ");
          newTimeInput[field] = !time
            ? // if input is empty => null
              null
            : new Date(
                `${dateSplitter[0]} ${dateSplitter[1]} ${dateSplitter[2]} ${
                  dateSplitter[3]
                } ${
                  // time is 12 hour format so if PM then time + 12 to covnert into 24hr format
                  finalIsPm.current
                    ? `${parseInt(time[0]!) + 12}:${time[1]}`
                    : finalTime
                }:00`,
              );
          newTimesheet[rowKey] = newTimeInput;
        }
        onSetTimesheets(activeTimesheet!.id, newTimesheet);
      }, 1000);
      return () => clearTimeout(timer);
    }

    const firstRenderTimer = setTimeout(() => {
      firstRender.current = true;
    }, 500);
    return () => clearTimeout(firstRenderTimer);
  }, [finalTime, isPm]);

  return (
    <div
      className={cn(
        "flex rounded-md py-0.5 pr-2.5 shadow-sm ring-offset-card sm:max-w-md",
        "splash-inputs-within splash-base-input items-center justify-center",
      )}
    >
      <PatternFormat
        format="##:##"
        allowEmptyFormatting
        value={value}
        onBlur={onInputBlur}
        onChange={(event) => setValue(event.target.value)}
        mask="-"
        id="time-in-monday"
        type="text"
        autoComplete="time-in-monday"
        className={cn(
          "flex h-10 w-full rounded-md border-0 border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-semibold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
          "w-12 border-0 bg-transparent text-center font-normal text-foreground",
        )}
      />
      {/* SWITCH */}
      <div className="flex flex-row items-center justify-center">
        <Switch
          checked={isPm}
          disabled={countDashOccurence == 4 || value == ""}
          onChange={(value) => {
            setIsPm(value);
            finalIsPm.current = value;
            onInputBlur();
          }}
          className={cn(
            isPm
              ? "bg-sky-600"
              : "bg-amber-500 disabled:bg-slate-200/30 disabled:dark:bg-slate-700/40",
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-md border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            className={cn(
              isPm ? "translate-x-5" : "translate-x-0",
              "pointer-events-none relative inline-block h-5 w-5 transform rounded-sm bg-white shadow ring-0 transition duration-200 ease-in-out",
            )}
          >
            <span
              className={cn(
                isPm
                  ? "opacity-0 duration-100 ease-out"
                  : "opacity-100 duration-200 ease-in",
                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
              )}
              aria-hidden="true"
            >
              <span
                className={cn(
                  "text-[9px] font-bold ",
                  countDashOccurence == 4 || value == ""
                    ? "text-muted-foreground"
                    : "text-amber-500 ",
                )}
              >
                AM
              </span>
            </span>
            <span
              className={cn(
                isPm
                  ? "opacity-100 duration-200 ease-in"
                  : "opacity-0 duration-100 ease-out",
                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
              )}
              aria-hidden="true"
            >
              <span className="text-[9px] font-bold text-sky-600">PM</span>
            </span>
          </span>
        </Switch>
      </div>
    </div>
  );
};
export default memo(TimeInput);
