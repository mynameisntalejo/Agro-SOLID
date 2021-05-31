import DataTable from "react-data-table-component";
import {eventsTableColumns} from "../functions/eventsTableColumns";
import Typography from "@material-ui/core/Typography";

export default function EventDataTable({data}) {
  return (
    <DataTable columns={eventsTableColumns}
               data={data}
               noHeader={true}
               highlightOnHover={true}
               noDataComponent={
                 <Typography gutterBottom
                             variant="body1"
                 >
                   No hay eventos que mostrar
                 </Typography>
               }
               defaultSortField="timestamp"
               pagination={true}
               paginationPerPage={4}
               paginationRowsPerPageOptions={[4, 8, 12, 16, 20]}
               paginationComponentOptions={
                 {
                   rowsPerPageText: "Registros por página",
                   rangeSeparatorText: "de",
                   selectAllRowsItem: true,
                   selectAllRowsItemText: "Todos"
                 }
               }
    />
  )
}