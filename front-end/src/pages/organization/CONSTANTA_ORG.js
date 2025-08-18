import Input from "../../components/Input/Input";
import TextArea from "../../components/Textarea/Index";

const FORM_FIELDS = [
  {
    row: 1,
    fields: [
      {
        component: Input,
        props: {
          label: "Nama",
          type: "text",
          name: "name",
          required: true,
          placeholder: "Nama",
          width: "w-1/2",
        },
      },
      {
        component: Input,
        props: {
          label: "Email",
          type: "email",
          name: "email",
          required: true,
          placeholder: "Email",
          width: "w-1/2",
        },
      },
    ],
  },
  {
    row: 2,
    fields: [
      {
        component: TextArea,
        props: {
          label: "Alamat",
          name: "alamat",
          required: true,
          placeholder: "Alamat",
          width: "w-1/2",
        },
      },
      {
        component: Input,
        props: {
          label: "Kota",
          type: "text",
          name: "kota",
          required: true,
          placeholder: "Kota",
          width: "w-1/2",
        },
      },
    ],
  },
  {
    row: 3,
    fields: [
      {
        component: Input,
        props: {
          label: "Provinsi",
          type: "text",
          name: "provinsi",
          required: true,
          placeholder: "Provinsi",
          width: "w-1/2",
        },
      },
    ],
  },
];

export { FORM_FIELDS };
