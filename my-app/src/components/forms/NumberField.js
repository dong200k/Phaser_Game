import Form from 'react-bootstrap/Form';

export default function NumberField(props) {
    const { controlId, label, text="", step=1, value=0, onChange } = props;
    return (
        <Form.Group className="mb-1" controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control type="number" step={step} onChange={onChange} value={value}/>
            <Form.Text>{text}</Form.Text>
        </Form.Group>
    )
}

