import { useState, useEffect } from "react";
import { BABox, BAButton, BAFormElement } from "../../../../components";
import BAScreenWrapper from "../../../../reuseableLayout/BAScreenWrapper";
import { formElement } from "../../../../components/BAComponentSwitcher";
import { Get } from "../../../../config/apimethods";
import { message } from "antd";
import { useParams } from "react-router";
import { LocationService } from "../../../../config/apiservices";
import { goBack } from "../../../../config/helpers";
import { SaveOutlined } from "@ant-design/icons";

export default function LocationForm() {
  const params = useParams();

  const [model, setModel] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);

  useEffect(() => {
    const lat = model.latitude;
    const lng = model.longitude;

    const hasLat = lat !== undefined && lat !== null && lat !== "";
    const hasLng = lng !== undefined && lng !== null && lng !== "";

    if (hasLat && hasLng) {
      const latNum = typeof lat === "number" ? lat : Number(lat);
      const lngNum = typeof lng === "number" ? lng : Number(lng);
      const next = !isNaN(latNum) && !isNaN(lngNum) ? `${latNum}, ${lngNum}` : "";
      if (model.LatLong !== next) {
        setModel((prev: any) => ({ ...prev, LatLong: next }));
      }
    } else if (model.LatLong) {
      setModel((prev: any) => ({ ...prev, LatLong: "" }));
    }
  }, [model.latitude, model.longitude]);

  const elems: formElement[] = [
    {
      col: 6,
      elementType: "input",
      key: "Name",
      label: "Location Name",
      type: "text",
      required: true,
    },
    {
      col: 6,
      elementType: "number",
      key: "RadiusMeters",
      label: "Radius (Meters)",
      required: true,
    },
    {
      col: 6,
      elementType: "number",
      key: "latitude",
      label: "Latitude",
      required: true,
      allowDecimal: true,
      preservePrecision: true,
    },
    {
      col: 6,
      elementType: "number",
      key: "longitude",
      label: "Longitude",
      required: true,
      allowDecimal: true,
      preservePrecision: true,
    },
    {
      col: 6,
      elementType: "select",
      key: "Category",
      label: "Category",
      options: [
        { label: "MDA & SDA", value: "MDA & SDA" },
        { label: "SDA Only", value: "SDA Only" },
        { label: "TV", value: "TV" },
      ],
      required: true,
    },
    {
      col: 6,
      elementType: "textarea",
      key: "Address",
      label: "Address",
      required: true,
    },
  ];

  const saveLocationConfig = () => {
    setSaveLoader(true);
    const payload = {
      ...model,
      RadiusMeters: Number(model.RadiusMeters)
    };
    LocationService.Save(payload, params.id)
      .then(() => {
        message.success("Location Config saved successfully");
        goBack();
      })
      .catch((err: any) => {
        console.log('Error saving location config:', err);
        message.error(err?.error || err?.Message || "Something went wrong");
      })
      .finally(() => {
        setSaveLoader(false);
      });
  };

  const getLocationConfigById = (id: string) => {
    setLoading(true);
    Get(`/location/${id}`)
      .then((res: any) => {
        const data = { ...res.Data };
        const latLongStr = typeof data.LatLong === "string" ? data.LatLong : "";
        let latitudeParsed: number | undefined = undefined;
        let longitudeParsed: number | undefined = undefined;
        if (latLongStr.includes(",")) {
          const [latStr, lngStr] = latLongStr.split(",");
          const latNum = Number((latStr || "").trim());
          const lngNum = Number((lngStr || "").trim());
          if (!isNaN(latNum)) latitudeParsed = latNum;
          if (!isNaN(lngNum)) longitudeParsed = lngNum;
        }
        setModel({
          ...data,
          ...(latitudeParsed !== undefined ? { latitude: latitudeParsed } : {}),
          ...(longitudeParsed !== undefined ? { longitude: longitudeParsed } : {}),
        });
      })
      .catch((err: any) => {
        message.error(
          err?.error || err?.message || "Failed to load setup config data"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (params.id) {
      getLocationConfigById(params.id);
    }
  }, []);

  return (
    <BAScreenWrapper
      title="Location"
      actions={[
        {
          displayField: () => (
            <BAButton
              onClick={saveLocationConfig}
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
          onSaveClick={saveLocationConfig}
          model={model}
          setModel={setModel}
          formElement={elems}
          hideButton={true}
        />
      </BABox>
    </BAScreenWrapper>
  );
}
