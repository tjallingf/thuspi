import Tile from '../Tile/Tile';
import InputText from '../Input/InputText';
import useTranslate from '../../hooks/useTranslate';

const AdminInputField = ({ id, scope, value }) => {
    return (
        <Tile title={useTranslate(`pages.admin.${scope}.manage.group.${id}.title`) || id}>
            <InputText value={value} />
        </Tile>
    );
}

export default AdminInputField;