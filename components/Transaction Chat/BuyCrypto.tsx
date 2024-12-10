import { ScrollView } from "react-native";
import { icons } from "@/constants";
import SelectField from "./SelectField";

const BuyCrypto: React.FC<{ selectedService: string }> = (props) => {
  const fields = [
    {
      id: "1",
      isClickable: false,
      icon: "",
      text: props.selectedService,
      label: "Service Type",
      onClickHandler: () => null,
    },
    {
      id: "2",
      isClickable: false,
      icon: "",
      text: "Bitcoin (BTC)",
      label: "Crypto Type",
      onClickHandler: () => null,
    },
    {
      id: "3",
      isClickable: false,
      icon: "",
      text: "Polygon",
      label: "Crypto chain type",
      onClickHandler: () => null,
    },
    {
      id: "4",
      isClickable: false,
      icon: "",
      text: "0.001",
      label: "Amount",
      onClickHandler: () => null,
    },
    {
      id: "5",
      isClickable: false,
      icon: "",
      text: "$100",
      label: "Amount - Dollars",
      onClickHandler: () => null,
    },
    {
      id: "6",
      isClickable: false,
      icon: "",
      text: "1 BTC/ 74,450",
      label: "Exchange Rate",
      onClickHandler: () => null,
    },
    {
      id: "7",
      isClickable: false,
      icon: "",
      text: "170,000",
      label: "Amount - Naira",
      onClickHandler: () => null,
    },
    {
      id: "8",
      isClickable: false,
      icon: "",
      text: "asdjf23iojhndnkndfklnv234bn",
      label: "From address",
      onClickHandler: () => null,
    },
    {
      id: "9",
      isClickable: false,
      icon: "",
      text: "asdjf23iojhndnkndfklnv234bn",
      label: "To address",
      onClickHandler: () => null,
    },
  ];

  return (
    <ScrollView style={{ flex: 1 }}>
      {fields.map((field) => (
        <SelectField
          key={field.id}
          isClickable={field.isClickable}
          icon={field.icon}
          text={field.text}
          label={field.label}
          onClickHandler={field.onClickHandler}
        />
      ))}
    </ScrollView>
  );
};

export default BuyCrypto;
