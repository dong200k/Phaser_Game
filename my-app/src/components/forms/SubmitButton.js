import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

export default function SubmitButton({ disabled, variant, children}) {
    return (
        <>
            <Button type="submit" variant={variant} className="btn btn-primary" disabled={disabled}>
                {children}
            </Button>
            {
                disabled ? 
                <Spinner animation="border" role="status" size="sm" style={{marginLeft: "5px"}}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : <></>
            }
        </>
    )

}
