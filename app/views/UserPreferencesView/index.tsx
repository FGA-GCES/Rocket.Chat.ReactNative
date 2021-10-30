import React, { useState } from 'react';
import { Switch } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import I18n from '../../i18n';
import log, { logEvent, events } from '../../utils/log';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import * as List from '../../containers/List';
import { SWITCH_TRACK_COLOR } from '../../constants/colors';
import { getUserSelector } from '../../selectors/login';
import RocketChat from '../../lib/rocketchat';

interface IUserPreferencesView {
	navigation: StackNavigationProp<any, 'UserPreferencesView'>;
}

class UserPreferencesView extends React.Component<IUserPreferencesView, any> {

	static navigationOptions = () => ({
		title: I18n.t('Preferences')
	});

	navigateToScreen = (screen: string) => {
		logEvent(events.SE_GO_USER_NOTIFICATION_PREF);
		const { navigation } = this.props;
		navigation.navigate(screen);

		const user = useSelector((state: any) => getUserSelector(state));
		const [enableParser, setEnableParser] = useState(user.enableMessageParserEarlyAdoption);

		const toggleMessageParser = async (value: any) => {
			try {
				await RocketChat.saveUserPreferences({ id: user.id, enableMessageParserEarlyAdoption: value });
				setEnableParser(value);
			} catch (e) {
				log(e);
			}
		};

		const renderMessageParserSwitch = () => (
			<Switch value={enableParser} trackColor={SWITCH_TRACK_COLOR} onValueChange={toggleMessageParser} />
		);

		return (
			<SafeAreaView testID='preferences-view'>
				<StatusBar />
				<List.Container>
					<List.Section>
						<List.Separator />
						<List.Item
							title='Notifications'
							onPress={() => this.navigateToScreen('UserNotificationPrefView')}
							showActionIndicator
							testID='preferences-view-notifications'
						/>
						<List.Separator />
					</List.Section>
					<List.Section>
						<List.Separator />
						<List.Item
							title='Enable_Message_Parser'
							testID='preferences-view-enable-message-parser'
							right={() => renderMessageParserSwitch()}
						/>
						<List.Separator />
					</List.Section>
				</List.Container>
			</SafeAreaView>
		);
	};
};

export default UserPreferencesView;
