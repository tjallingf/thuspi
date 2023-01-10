import { useState, useEffect } from 'react';
import LoadingIcon from '../components/Icon/LoadingIcon';
import Show from '../components/Show';
import axios from 'axios';
import { map } from 'lodash';
import useDate from '../hooks/useDate';
import { trim } from 'lodash';
import Icon from '../components/Icon/Icon';
import '../styles/pages/AdminLog.scss';

const AdminLog = () => {
    const [ messages, setMessages ] = useState(null);

    useEffect(() => {
        (async () => setMessages(
            (await axios.get('api/log')).data
        ))();
    }, []);

    const formatTime = (time) => {
        const dt = new Date(time * 1000);

        return useDate(dt, { time: 'exact', date: 'exact' });
    }

    const getLevelIcon = (level) => {
        switch(level) {
            case 'success':
                return <Icon name="check-circle" color="green" />;
            case 'debug':
                return <Icon name="ban-bug" color="purple" />;
            case 'warn':
                return <Icon name="circle-exclamation" color="yellow" />;
            case 'error':
                return <Icon name="times-circle" color="red" />;
            default:
                return <Icon name="info-circle" color="blue" />;
        }
    }

    const getSourceIcon = ({ type, name }) => {
        switch(type) {
            case 'lib':
                return <Icon name="cog" color="blue" />;
            case 'ext':
                return <Icon name="puzzle-piece" color="purple" />;
        }
    }

    const formatContent = (content) => {
        return trim(content, '.')+'.';
    }

    return (
        <Show when={messages} fallback={<LoadingIcon />}>
            <div className="AdminLog container">
                {map(messages, message => (
                    <>
                        <span className="AdminLog__message__status">{getLevelIcon(message?.level)}</span>
                        <span className="AdminLog__message__time text-muted">{formatTime(message?.time)}</span>
                        {/* <span className="AdminLog__message__source">{getSourceIcon(message?.source)}</span> */}
                        <span className="AdminLog__message__content">{formatContent(message?.content)}</span>
                    </>
                ))}
            </div>
        </Show>
    )
}

export default AdminLog;