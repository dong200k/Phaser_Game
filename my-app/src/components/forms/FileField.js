import Form from 'react-bootstrap/Form';

export default function FileField({ controlId, label, text="", onChange, accept="*/*" }) {
    return (
        <Form.Group className="mb-1" controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control type="file" onChange={onChange} accept={accept} />
            <Form.Text>{text}</Form.Text>
        </Form.Group>
    )
}

