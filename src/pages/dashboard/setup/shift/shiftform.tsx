import { useState, useEffect } from "react";
import { BABox, BAButton, BAFormElement } from "../../../../components";
import BAScreenWrapper from "../../../../reuseableLayout/BAScreenWrapper";
import { formElement } from "../../../../components/BAComponentSwitcher";
import { Get } from "../../../../config/apimethods";
import { message } from "antd";
import { useParams } from "react-router";
import { ShiftService } from "../../../../config/apiservices";
import { goBack } from "../../../../config/helpers";
import { SaveOutlined } from "@ant-design/icons";

export default function ShiftForm() {
  const params = useParams();

  const [model, setModel] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const timeOptions = [
    { label: "0", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
    { label: "19", value: "19" },
    { label: "20", value: "20" },
    { label: "21", value: "21" },
    { label: "22", value: "22" },
    { label: "23", value: "23" },
    { label: "24", value: "24" },
    { label: "25", value: "25" },
    { label: "26", value: "26" },
    { label: "27", value: "27" },
    { label: "28", value: "28" },
    { label: "29", value: "29" },
    { label: "30", value: "30" },
    { label: "31", value: "31" },
    { label: "32", value: "32" },
    { label: "33", value: "33" },
    { label: "34", value: "34" },
    { label: "35", value: "35" },
    { label: "36", value: "36" },
    { label: "37", value: "37" },
    { label: "38", value: "38" },
    { label: "39", value: "39" },
    { label: "40", value: "40" },
    { label: "41", value: "41" },
    { label: "42", value: "42" },
    { label: "43", value: "43" },
    { label: "44", value: "44" },
    { label: "45", value: "45" },
    { label: "46", value: "46" },
    { label: "47", value: "47" },
    { label: "48", value: "48" },
    { label: "49", value: "49" },
    { label: "50", value: "50" },
    { label: "51", value: "51" },
    { label: "52", value: "52" },
    { label: "53", value: "53" },
    { label: "54", value: "54" },
    { label: "55", value: "55" },
    { label: "56", value: "56" },
    { label: "57", value: "57" },
    { label: "58", value: "58" },
    { label: "59", value: "59" },
  ]

  const elems: formElement[] = [
    {
      col: 6,
      elementType: "input",
      key: "Name",
      label: "Shift Name",
      type: "text",
      required: true,
    },
    {
      col: 6,
      elementType: "select",
      key: "WeeklyOffDay",
      label: "Weekly Off Day",
      options: [
        { label: "Monday", value: "Monday" },
        { label: "Tuesday", value: "Tuesday" },
        { label: "Wednesday", value: "Wednesday" },
        { label: "Thursday", value: "Thursday" },
        { label: "Friday", value: "Friday" },
        { label: "Saturday", value: "Saturday" },
        { label: "Sunday", value: "Sunday" },
      ],
      required: true,
    },
    {
      col: 6,
      elementType: "timepicker",
      key: "Start",
      label: "Start Time",
      required: true,
    },
    {
      col: 6,
      elementType: "timepicker",
      key: "End",
      label: "End Time",
      required: true,
    },
    {
      col: 6,
      elementType: "select",
      key: "BreakMinutes",
      label: "Break Time (Minutes)",
      options: timeOptions,
      required: true,
    },
    {
      col: 6,
      elementType: "select",
      key: "RoundingRule",
      label: "Rounding Rule (Minutes)",
      options: timeOptions,
      required: true,
    },
  ];

  const saveShiftConfig = () => {
    setSaveLoader(true);
    const payload = {
      ...model,
      BreakMinutes: Number(model.BreakMinutes),
      RoundingRule: Number(model.RoundingRule),
    };
    ShiftService.Save(payload, params.id)
      .then(() => {
        message.success("Shift saved successfully");
        goBack();
      })
      .catch((err: any) => {
        console.log('Error saving shift:', err);
        message.error(err?.error || err?.Message || "Something went wrong");
      })
      .finally(() => {
        setSaveLoader(false);
      });
  };

  const getShiftConfigById = (id: string) => {
    setLoading(true);
    Get(`/workschedule/${id}`)
      .then((res: any) => {
        const data = { ...res.Data };
        setModel({
          ...data,
        });
      })
      .catch((err: any) => {
        message.error(
          err?.error || err?.message || "Failed to load shift data"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (params.id) {
      getShiftConfigById(params.id);
    }
  }, []);

  return (
    <BAScreenWrapper
      title="Shift"
      actions={[
        {
          displayField: () => (
            <BAButton
              onClick={saveShiftConfig}
              label="Save"
              loading={saveLoader}
              icon={<SaveOutlined />}
            />
          ),
        },
      ]}
    >
      <BABox className=" bg-white mt-4 p-4 rounded-lg">
        <BAFormElement
          loading={loading}
          saveLoader={saveLoader}
          onSaveClick={saveShiftConfig}
          model={model}
          setModel={setModel}
          formElement={elems}
          hideButton={true}
        />
      </BABox>
    </BAScreenWrapper>
  );
}
