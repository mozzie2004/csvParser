import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Form, Navbar, Container, Jumbotron, Alert, Button } from 'react-bootstrap';
import TableData from '../table-data/table-data';
import EmptyTable from '../empty-table/empty-table';
import TransformDataservice from '../../services/transformDataservice';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

    const [data, setData] = useState(null);
    const [titles, setTitles] = useState(null)
    const [errorMwssage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const form = useRef(null);
    const transformData = new TransformDataservice();

    const onChange = (e) => {
        setErrorMessage('');
        setShowError(false)

        const file = e.target.files[0];

        if (!file || file.name.split('.').pop() !== 'csv') {
            setErrorMessage('File format is not corect');
            setShowError(true);
            form.current.reset();
            return
        }
        Papa.parse(file, {
            complete: (res) => transformData.getData(res, setTitles, setErrorMessage, setData, setShowError, form),
            header: true
        })
    }

    const onImport = () => {
        transformData.readStaticFile()
            .then(res => Papa.parse(res, { header: true }))
            .then((res) => transformData.getData(res, setTitles, setErrorMessage, setData, setShowError, form))
            .catch(e => setErrorMessage('Something wrong'));

    }


    const alert = (
        <Alert className="mt-5" show={showError} variant="danger">
            <Alert.Heading>{errorMwssage}</Alert.Heading>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => { setShowError(false); setErrorMessage(''); setData(null) }} variant="outline-danger">
                    Close
          </Button>
            </div>
        </Alert>
    );

    const table = errorMwssage ? alert : data ? <TableData titles={titles} data={data} /> : <EmptyTable />;

    return (
        <>
            <Navbar bg="dark">
                <form ref={form}>
                    <Form.File
                        onChange={onChange}
                        id="custom-file"
                        label="choose your csv file"
                        custom
                    />
                </form>
            </Navbar>
            <Jumbotron className="min-vh-100">
                <Container>
                    <div className="d-flex justify-content-end">
                        <Button onClick={onImport} variant="outline-dark">
                            import from static file
                    </Button>
                    </div>
                    {
                        table
                    }
                </Container>
            </Jumbotron>
        </>
    )
}

export default App;