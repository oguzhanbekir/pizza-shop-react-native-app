import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {Input, Icon} from 'react-native-elements';
import {TouchableOpacity, Text, View, StyleSheet, FlatList, Image} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {connect} from 'react-redux';
import {httpClient} from '../../../HttpClient/HttpClient';
import DoughSelection from './DoughSelection';
class PizzaSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productDetail: this.props.productDetail2,
            itemDetail: [],
            productCampaignDetail: [],
         //   productDetailOptions : this.props.productDetailOptions.length != '' && this.props.productDetailOptions ,
        };
    }

    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
        );
    };
    _renderItem = ({item}) => {
        return (
            <View style={styles.item}>
                <TouchableOpacity
                    onPress={() => this.selectionPizza(item)}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Image
                            style={{height: 70, width: 120}}
                            source={{uri: item.image}}
                        />
                        <View style={{paddingLeft: 10, width: 230}}>
                            <Text style={styles.titleName}>{item.name}</Text>
                            <Text
                                style={styles.titlePrice}>{item.price.price === 0 ? '' : '+ ₺' + item.price.price.toFixed(2)}</Text>
                        </View>
                    </View>
                    <Text style={styles.titleDetail}>{item.detail}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    selectionPizza(productDetail) {
      //  console.log(productDetail);
        httpClient
            .get('/web/Product/GetProductDetails?ProductId=' + productDetail.id + '&OptionId=' + this.props.id + '&ParentId=' + this.props.productDetail.id + '&existingOrderId=' + this.props.existingOrderId)
            .then(res => {
                this.setState(prevState => ({
                    productDetail: {
                        ...prevState.productDetail,
                        options:
                            prevState.productDetail.options.map(
                                data => data.id === this.props.id ? {
                                    ...data,
                                    items: data.items.map(
                                        data => data.id === productDetail.id ? {
                                            ...data,
                                            options: res.data.result.options,
                                            quantity:1,
                                        } : {...data, options: null,quantity:0},
                                    ),
                                } : {...data},
                            ),
                    },

                    productCampaignDetail: res.data.result,
                }), () => {
                    httpClient
                        .post('/web/Product/CalculatePrice', {
                            BasketItem: this.state.productDetail,
                            IncludeItemPrice: true,
                        })
                        .then(res => {
                            //  alert(res.data)
                        });
                    // console.log(res.data.result)
                   // console.log(this.state.productDetail.options.find(data => data.id === this.props.id).items.find(data => data.id === productDetail.id))
                    this.setState({
                        itemDetail: this.state.productDetail.options.find(data => data.id === this.props.id).items.find(data => data.id === productDetail.id)
                    }, () => {
                        console.log(this.state.productDetail.options.find(data => data.id === this.props.id));
                     //   console.log(this.state.itemDetail)
                    });

                    // this.props.productCampaignDetailData(res.data.result);
                   // console.log(this.state.productCampaignDetail)
                    this.props.productDetailData(this.state.productDetail);

                });
            });

      //  {this.props.productDetailOptions.length != '' && console.log(this.props.productDetailOptions)}
       // this.props.selectionPizza(productDetail.id, this.props.id, this.props.productDetail.id, this.props.existingOrderId);
        /*this.setState({
            itemDetail: productDetail,
            productCampaignDetail:this.props.productCampaignDetail
        }, () => {

            //console.log(this.props.productDetailOptions)
        });*/
       // console.log(this.props.productCampaignData)
      //  console.log(this.props.productDetailOptions)


       this.props.productDetailData(productDetail)
        this.RBSheet.close()
    }

    render() {


        const {
            name,
            data,
        } = this.props;
        return (

            <View style={{flex: 1}}>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={400}
                    duration={250}
                    customStyles={{
                        container: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    }}
                >
                    <Fragment>
                        <Text style={styles.title}>{data.name}</Text>
                        <FlatList
                            data={this.state.productDetail.options.find(data => data.id === this.props.id).items.sort(function (a, b) {
                                return parseInt(a.price.price) - parseInt(b.price.price);
                            })}
                            renderItem={this._renderItem}
                            keyExtractor={data => data.id}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            extraData={this.state.productDetail}
                        />
                    </Fragment>
                </RBSheet>
                {this.state.itemDetail.length === 0 ?
                    <TouchableOpacity style={{padding: 20, flex: 1, backgroundColor: '#fff', marginTop: 10}}
                                      onPress={() => this.RBSheet.open()}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Text>{name}</Text>
                            <Icon
                                size={17}
                                name="plus-circle"
                                type="feather"
                            />
                        </View>
                    </TouchableOpacity> :
                    <View style={styles.itemDetail}>
                        <TouchableOpacity
                            onPress={() => this.RBSheet.open()}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Image
                                    style={{height: 70, width: 120}}
                                    source={{uri: this.state.itemDetail.image}}
                                />
                                <View style={{flex:1,paddingLeft: 10}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                        <Text style={styles.titleName}>{this.state.itemDetail.name}</Text>
                                        <Icon
                                            size={20}
                                            name="plus-circle"
                                            type="feather"
                                        />
                                    </View>
                                    <Text style={styles.titlePrice}>
                                        {this.state.itemDetail.price.price === 0 ? null :'₺' + this.state.itemDetail.price.price.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.titleDetail}>{this.state.itemDetail.detail}</Text>
                            <View style={{flex: 1, marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={{flex: 1, padding: 10}}
                                    onPress={() => this.props.navigation.navigate('Ingredient', {
                                        name: 'from parent',
                                        updateData: this.updateData,
                                    })}
                                >
                                    <Text style={styles.titlePrice}>{'MALZEME EKLE/ÇIKAR'}</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                        <DoughSelection productDetail={this.state.itemDetail}  />
                    </View>}
            </View>
        );
    }
}

PizzaSelection.propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    data: PropTypes.object,
};

PizzaSelection.defaultProps = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    item: {
        padding: 10,
        paddingLeft: 15,
    },
    itemDetail: {
        backgroundColor: '#fff',
        padding: 10,
        paddingLeft: 15,
        marginVertical: 15,
    },
    titleName: {
        fontSize: 16,
        fontWeight: '600',
    },
    titlePrice: {
        fontSize: 14,
        fontWeight: '700',
        color: 'orange',
    },
    titleDetail: {
        paddingTop: 5,
        fontSize: 10,
        fontWeight: '600',
        color: 'dimgray',
    },
    title: {
        padding: 10,
        fontSize: 20,
        fontWeight: '600',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },


});

const mapStateToProps = state => {
    return {
        existingOrderId: state.GetBasketReducer.id,
        productDetail: state.ProductDetailDataReducer.data,
        productCampaignDetail: state.ProductDetailDataReducer.campaignDetailData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        productDetailData: (data) => dispatch({type: 'PRODUCT_CAMPAIGN_DATA', payload: data}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PizzaSelection);
