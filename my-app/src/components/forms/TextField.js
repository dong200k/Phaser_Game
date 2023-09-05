import Form from 'react-bootstrap/Form';

export default function TextField({ controlId, label, text="", onChange, placeholder="", value="", disabled=false }) {
    return (
        <Form.Group className="mb-1" controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control type="text" onChange={onChange} value={value} placeholder={placeholder} disabled={disabled} />
            <Form.Text>{text}</Form.Text>
        </Form.Group>
    )
}
