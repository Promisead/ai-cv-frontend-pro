import React from "react";
import EditCV1 from "./EditCv1";
import EditCV2 from "./EditCv2";
import { useParams } from "react-router-dom";


const EditCV = () => {
    let { id } = useParams()
    if (id === 'template1') {
        return <EditCV1 />
    } else if (id === 'template2') {
        return <EditCV2 />
    } 
};

export default EditCV;