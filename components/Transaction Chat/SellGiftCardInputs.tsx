import { ScrollView } from "react-native";
import { icons } from "@/constants";
import SelectField from "./SelectField";

const SellGiftCardInputs: React.FC<{ selectedService: string }> = (props) => {
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
      text: "Amazon",
      label: "Gift Card Name",
      onClickHandler: () => null,
    },
    {
      id: "3",
      isClickable: false,
      icon: "",
      text: "Amazon Gift card",
      label: "Gift card type",
      onClickHandler: () => null,
    },
    {
      id: "4",
      isClickable: false,
      icon: "",
      text: "United States",
      label: "Gift card country",
      onClickHandler: () => null,
    },
    {
      id: "5",
      isClickable: false,
      icon: "",
      text: "E-code",
      label: "Card Type",
      onClickHandler: () => null,
    },
    {
      id: "6",
      isClickable: false,
      icon: "",
      text: "1cknfjn2394unfkcdwi2",
      label: "Card Number",
      onClickHandler: () => null,
    },
    {
      id: "7",
      isClickable: false,
      icon: "",
      text: "$100",
      label: "Amount - Dollars",
      onClickHandler: () => null,
    },
    {
      id: "8",
      isClickable: false,
      icon: "",
      text: "NGN1700 / $1",
      label: "Exchange Rate",
      onClickHandler: () => null,
    },
    {
      id: "9",
      isClickable: false,
      icon: "",
      text: "170,000",
      label: "Amount - Naira",
      onClickHandler: () => null,
    },
    {
      id: "10",
      isClickable: false,
      icon: "",
      text: "Dave",
      label: "Name of Agent",
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

export default SellGiftCardInputs;
