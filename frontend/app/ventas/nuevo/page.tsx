"use client";

import FormElement from "@/components/form-page/form-element";
import { useState, useEffect } from "react";
import { NumberInput } from "@/components/form/number-input-element";
import AsyncSelect from "react-select/async"; // Importa AsyncSelect desde react-select

export type SaleInputData = {
    user: string;
    product: string;
    amountOfProduct: number;
};
// Definir el tipo ApiSaleData 
export type ApiSaleData = {
    id: string;
    user: { id: string; name: string }; // Ajusta según los datos reales
    product: { id: string; name: string }; // Ajusta según los datos reales
    amountOfProduct: number;
};


// Función para realizar la búsqueda de opciones desde el backend
async function fetchOptions(endpoint: string, inputValue: string) {
    const response = await fetch(`http://localhost:3000/${endpoint}/search?query=${inputValue}`);
    const data = await response.json();
    return data.map((item: { id: string, name: string }) => ({
        label: item.name, 
        value: item.id
    }));
}

function buildOnChangeCallback(setCallback: React.Dispatch<React.SetStateAction<string>>) {
    return (element: React.ChangeEvent<HTMLInputElement>) => setCallback(element.target.value);
}

export default function(props: { 
    children?: React.ReactNode, 
    className?: string,
    sale?: ApiSaleData
}) {
    const [user, setUser] = useState(props.sale?.user.id || "");
    const [product, setProduct] = useState(props.sale?.product.id || "");
    const [amountOfProduct, setAmountOfProduct] = useState(props.sale?.amountOfProduct || 0);

    useEffect(() => {
        if (props.sale) {
            setUser(props.sale.user.id);
            setProduct(props.sale.product.id);
            setAmountOfProduct(props.sale.amountOfProduct);
        }
    }, [props.sale]);

    return (
        <FormElement<SaleInputData>
            recordId={props.sale?.id}
            apiEntityName="sale"
            appEntityName="ventas"
            editionHeading="Editar venta"
            insertionHeading="Insertar venta nueva"
            getPayload={() => ({ user, product, amountOfProduct })}
        >
            {/* Autocompletado para Usuario */}
            <label htmlFor="user-select">Usuario</label>
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={(inputValue) => fetchOptions("user", inputValue)}
                onChange={(selectedOption) => setUser(selectedOption?.value || "")}
                placeholder="Seleccione un Usuario"
                value={user ? { label: user, value: user } : null}
                id="user-select"
            />
            
            {/* Autocompletado para Producto */}
            <label htmlFor="product-select">Producto</label>
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={(inputValue) => fetchOptions("product", inputValue)}
                onChange={(selectedOption) => setProduct(selectedOption?.value || "")}
                placeholder="Seleccione un Producto"
                value={product ? { label: product, value: product } : null}
                id="product-select"
            />
            
            {/* Campo para la cantidad de producto */}
            <NumberInput
                label="Cantidad de Producto"
                required
                placeholder="1"
                value={amountOfProduct}
                onChange={(value) => setAmountOfProduct(value)}
            />
        </FormElement>
    );
}
