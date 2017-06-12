import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';

class Userpic extends Component {
    static propTypes = {
        account: PropTypes.string
    }

    shouldComponentUpdate = shouldComponentUpdate(this, 'Userpic')

    render() {
        const {json_metadata, width, height, night_mode} = this.props
        const hideIfDefault = this.props.hideIfDefault || false

        let url = null;

        // try to extract image url from users metaData
        try {
            const md = JSON.parse(json_metadata);
            if(md.profile) url = md.profile.profile_image;
        } catch (e) {}

        if (url && /^(https?:)\/\//.test(url)) {
            const size = width && width > 48 ? '320x320' : '120x120';
            if($STM_Config.img_proxy_prefix) {
                url = $STM_Config.img_proxy_prefix + size + '/' + url;
            }
        } else {
            if(hideIfDefault) {
                return null;
            }
            let filename = night_mode ? 'user-inverse': 'user';
            url = require('app/assets/images/' + filename + '.png');
        }

        const style = {backgroundImage: 'url(' + url + ')',
                       width: (width || 48) + 'px',
                       height: (height || 48) + 'px'}

        return <div className="Userpic" style={style} />;
    }
}

export default connect(
    (state, ownProps) => {
        const {account, width, height, hideIfDefault} = ownProps;
        let myAccount = state.user.getIn(['current', 'username']);
        let night_mode = false;
        if(!!myAccount){
            const json_metadata = state.global.getIn(['accounts', myAccount, 'json_metadata']);
            try {
                const md = JSON.parse(json_metadata);
                if(md.profile) {
                    night_mode = !!md.profile.night_mode;
                }
            } catch(e){}
        }
        return {
            json_metadata: state.global.getIn(['accounts', account, 'json_metadata']),
            night_mode: night_mode,
            width,
            height,
            hideIfDefault,
        }
    }
)(Userpic)
