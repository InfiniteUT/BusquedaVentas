import axios from "axios";
import { saleApiEndpoints } from "@/urls";
import NewSale from "../../nuevo/page";

export default async function (props: { params: { id: string } }) {
    const endpoint = saleApiEndpoints.find(props.params.id);

    return axios
        .get(endpoint)
        .then(response => response.data.details)
        .then(sale => {
            // El objeto 'sale' ya contiene los ids de producto y usuario, y los nombres.
            return <NewSale sale={sale} />
        });
}
