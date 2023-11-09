import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export default function BackupHome() {
    
    const navigate = useNavigate();

    const backupOnclick = () => {
        navigate("/backup/backup");
    }

    const restoreOnclick = () => {
        navigate("/backup/restore");
    }

    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md="auto"> <h2>Backup and Restore</h2> </Col>
            </Row>
            <Row md={2} xs={1}>
                <Col style={{textAlign:"center"}}>
                    <Button variant="primary" onClick={backupOnclick}>
                        Backup
                    </Button>
                    <p>
                        Creating a backup will allow you to backup firestore and cloud storage data.
                        You may choose which collections and documents to backup. The data will be downloaded 
                        as a zip file.
                    </p>
                </Col>
                <Col style={{textAlign:"center"}}>
                    <Button variant="primary" onClick={restoreOnclick}> 
                        Restore
                    </Button>
                    <p>
                        Restore a backup from a previously downloaded zip file. You can then
                        choose which collection and documents to restore. The selected files 
                        will either be added to firestore and cloud storage if it does not yet exist. 
                        Or it will replace the existing data.
                    </p>
                </Col>
            </Row>
        </Container>
    )
}
