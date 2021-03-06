import React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator, HeaderBackButton} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Icon} from 'react-native-elements';
import {fromRight} from 'react-navigation-transitions';
import BottomTabBar from 'react-navigation-selective-tab-bar';

import {httpClient} from '../HttpClient/HttpClient';


import Home from '../Pages/Home';
import Basket from '../Pages/Basket';
import Products from '../Pages/Products';
import PaymentType from '../Pages/PaymentType';
import Settings from '../Pages/Settings';
import Restaurants from '../Pages/Restaurants';
import DirectionMain from '../Pages/DirectionMain';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import ProductDetail from '../Pages/ProductDetail';
import Ingredient from '../Pages/Ingredient';

import CheckForLogin from './CheckForLogin';
import {connect} from 'react-redux';

const headerStyleRegister = 'Kayıt Ol';
const headerStyleLogin = 'Giriş Yap';
const headerStyleSkip = 'ŞİMDİLİK GEÇ';
const headerStyleHome = 'ANASAYFA';
const headerStyleProducts = 'ÜRÜNLER';
const headerStyleBasket = 'SEPETİM';
const headerStylePaymentType = 'TESLİMAT TİPİ';


const HomeTab = createStackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: ({navigation}) => {
                return {
                    headerTitle: navigation.getParam('title', headerStyleHome),

                };
            },
        },
        Restaurants: {
            screen: Restaurants,
            navigationOptions: ({navigation}) => {
                return {
                    headerTitle: 'Restoranlar',
                };
            },
        },
    },
    {
        initialRouteName: 'Home',
        transitionConfig: () => fromRight(),
    },
);

HomeTab.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

function addFavoriteProduct(navigation) {
    httpClient
        .post('/web/Member/AddFavoriteProduct', {
            ProductId: navigation.state.params.id,
        })
        .then(res => {

            if (!res.data.message) {
                navigation.setParams({heart: true});
                alert('olduuu');
            } else {
                Alert.alert('', res.data.message, [{text: 'OK'}], {
                    cancelable: false,
                });
            }
        });
}

function deleteFavoriteProduct(navigation) {
    httpClient
        .delete('/web/Member/DeleteFavoriteProduct?id=' + navigation.state.params.id)
        .then(res => {
            console.log(res);
            if (!res.data.message) {
                navigation.setParams({heart: false});
            } else {
                Alert.alert('', res.data.message, [{text: 'OK'}], {
                    cancelable: false,
                });
            }
        });

}

const ProductsTab = createStackNavigator(
    {
        Products: {
            screen: Products,
            navigationOptions: ({navigation}) => {
                return {
                    headerTitle: navigation.getParam('title', headerStyleProducts),

                };
            },
        },
        ProductDetail: {
            screen: ProductDetail,
            navigationOptions: ({navigation}) => {
                httpClient
                    .get('/web/Member/GetFavoriteProducts')
                    .then(res => {
                        const data = res.data.result.find(data => data.id === navigation.state.params.id) || {id: ''};
                        if (data.id === navigation.state.params.id) {
                            navigation.setParams({heart: true});
                        }
                    });
                return {
                    headerTitle: null,
                    headerRight: (
                        <TouchableOpacity
                            disabled={!navigation.state.params.loggedIn}
                            onPress={() => navigation.state.params.heart ? deleteFavoriteProduct(navigation) : addFavoriteProduct(navigation)}
                            style={{marginRight: 20}}>
                            {navigation.state.params.loggedIn ?
                                <Icon size={25} name={navigation.state.params.heart ? 'heart' : 'heart-outlined'}
                                      type="entypo" color={navigation.state.params.heart ? 'red' : 'black'}/> : null}
                        </TouchableOpacity>
                    ),
                };
            },
        },
        Ingredient: {
            screen: Ingredient,
            navigationOptions: ({navigation}) => {
                return {
                    headerTitle: 'Malzeme Ekle/Çıkar',
                };
            },
        },
    },
    {
        initialRouteName: 'Products',
        transitionConfig: () => fromRight(),
    },
);

ProductsTab.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};
const BasketTab = createStackNavigator(
    {
        Basket,
    },
    {
        defaultNavigationOptions: {
            headerStyle: {},
            title: headerStyleBasket,
        },
    },
);

const PaymentTypeTab = createStackNavigator(
    {
        PaymentType,
    },
    {
        defaultNavigationOptions: {
            headerStyle: {},
            title: headerStylePaymentType,
        },
    },
);

const SettingsTab = createStackNavigator(
    {
        Settings,
    },
    {
        defaultNavigationOptions: {
            headerStyle: {},
            headerTintColor: '#FFFFFF',
            title: 'Settings Tab',
        },
    },
);

const MainApp = createBottomTabNavigator(
    {
        Home: {
            screen: HomeTab,
        },
        Products: {
            screen: ProductsTab,
            navigationOptions: {
                title: 'ÜRÜNLER',
            },
        },
        Basket: {
            screen: BasketTab,
            navigationOptions: {
                title: 'SEPETİM',
            },
        },
        PaymentType: {
            screen: PaymentTypeTab,
            navigationOptions: {
                title: 'TESLİMAT TİPİ',
            },
        },
        Settings: {
            screen: SettingsTab,
            navigationOptions: {
                title: 'DAHA FAZLA',
            },
        },

    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarComponent: props => {
                const bottomTab = ['Home', 'Products', 'Basket', 'PaymentType'];
                const bottomTabLogged = ['Home', 'Products', 'Basket', 'PaymentType', 'Settings'];
                return (
                    <BottomTabBar
                        {...props} // Required
                        display={props.screenProps.loggedIn ? bottomTabLogged : bottomTab} // Required
                    />
                );
            },
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                const items = {
                    Home: 'home',
                    Products: 'pie-chart',
                    Basket: 'shopping-basket',
                    PaymentType: 'shop',
                    Settings: 'menu',
                };
                const itemsType = {
                    Anasayfa: 'entypo',
                    Products: 'feather',
                    Basket: 'entypo',
                    PaymentType: 'entypo',
                    Settings: 'feather',
                };

                return (
                    <Icon
                        color={tintColor}
                        name={items[routeName]}
                        type={itemsType[routeName]}
                    />
                );
            },
        }),
        tabBarOptions: {
            activeTintColor: '#FF6F00',
            inactiveTintColor: 'gray',
            scrollEnabled: true,
            labelStyle: {
                fontSize: 10,
            },
        },
    },
);
const AuthNavigator = createStackNavigator(
    {
        DirectionMain: {
            screen: DirectionMain,
            navigationOptions: ({navigation}) => {
                return {
                    header: null,
                };
            },
        },
        Login: {
            screen: Login,
            navigationOptions: ({navigation}) => {
                return {
                    headerTitle: headerStyleLogin,
                    headerRight: (
                        <Text
                            onPress={() => navigation.navigate('Home')}
                            style={{paddingRight: 10}}>
                            {headerStyleSkip}
                        </Text>
                    ),
                };
            },
        },
        Register: {
            screen: Register,
            navigationOptions: ({navigation}) => {
                return {
                    headerTitle: headerStyleRegister,
                    headerRight: (
                        <Text
                            onPress={() => navigation.navigate('Home')}
                            style={{paddingRight: 10}}>
                            {headerStyleSkip}
                        </Text>
                    ),
                };
            },
        },
    },
    {
        initialRouteName: 'DirectionMain',
        transitionConfig: () => fromRight(),
    },
);

AuthNavigator.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

const SwitchNavigator = createSwitchNavigator(
    {
        Check: CheckForLogin,
        Home: MainApp,
        Auth: AuthNavigator,
    },
    {
        defaultNavigationOptions: {
            initialRouteName: 'Check',
            headerMode: 'none',
        },
    },
);


const mapStateToProps = state => {

    // alert(this.state.loggedIn)
    return {
        loggedIn: state.AuthReducer.loggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(createAppContainer(SwitchNavigator));
