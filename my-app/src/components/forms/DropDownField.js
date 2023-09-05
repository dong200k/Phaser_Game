import Form from 'react-bootstrap/Form';

export default function DropDownField({ controlId, children, onChange, value, text="", label }) {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange}>
                {children}
            </Form.Select>
            <Form.Text>{text}</Form.Text>
        </Form.Group>
    )
}