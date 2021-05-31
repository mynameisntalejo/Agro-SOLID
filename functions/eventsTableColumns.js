import Typography from "@material-ui/core/Typography";

export const eventsTableColumns = [
  {
    name: <Typography variant="overline" className="font-weight-bold">Tipo</Typography>,
    selector: "type",
    sortable: true,
    compact: true,
    wrap: true,
  },
  {
    name: <Typography variant="overline" className="font-weight-bold">Cultivo</Typography>,
    selector: "crop",
    sortable: true,
    compact: true,
    wrap: true,
  },
  {
    name: <Typography variant="overline" className="font-weight-bold">Cantidad</Typography>,
    selector: "quantity",
    sortable: true,
    compact: true,
    wrap: true,
  },
  {
    name: <Typography variant="overline" className="font-weight-bold">Fecha</Typography>,
    selector: "timestamp",
    sortable: true,
    compact: true,
    wrap: true,
  },
];