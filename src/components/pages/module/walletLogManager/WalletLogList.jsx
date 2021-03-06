import React from 'react';
import { Table, Modal,Button , message,Popconfirm,Select,Input,DatePicker } from 'antd';
import {getWalletLogList} from '../../../../axios';
import { formatTime } from '../../../../utils/FormatUtils.js';

const RangePicker = DatePicker.RangePicker;
export default class WalletLogList extends React.Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        pageParms: {},
        edtingUserData:{}
    }

    fetchData(offset){
        this.setState({ loading: true });
        let pageParms=this.state.pageParms;
        getWalletLogList(offset,10,pageParms).then( res => {
            let list = [];
            const pagination = { ...this.state.pagination };
            if(res.code === '000' && res.data &&  res.data.list){
                res.data.list.map((item,index)=>{
                    return item.key = index;
                });
                list = res.data.list;
                pagination.total = res.data.total;
            }
            this.setState({
                visible: false,
                data: list,
                loading: false,
                pagination
            });
        });
    }

    componentDidMount(){
        this.fetchData(0, 10);
    }

    handleTableChange(pagination, filters, sorter){
        this.setState({ pagination: pagination});
        this.fetchData(pagination.current,pagination.pageSize);
    }

    search(e) {
        this.fetchData(0, 10);
    }

     handleSelectChange(dataField,evt) {
         let value = evt && evt.target ? evt.target.value : evt;
         this.state.pageParms[dataField]= value;
         this.setState({});
    }

    onDateChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        this.state.pageParms.startTime=dateStrings[0];
        this.state.pageParms.endTime=dateStrings[1];
    }

    render() {
        let that=this;
        const columns = [{
            title: '序号',           
            render: (text,record,index) => <a>{index}</a>,
        },{
            title: '用户名',
            dataIndex: 'name',
            render: text => <a>{text}</a>,
        },  {
            title: '变更金额',
            dataIndex: 'changeAmount',
        },  {
            title: '变更后金额',
            dataIndex: 'newAmount',
        },{
            title: '变更原因',
            dataIndex: 'changeReason',
        },{
            title: '交易时间',
            dataIndex: 'changeTime',
			render: time=>formatTime(new Date(time)),
        }];

        const { data } = this.state;

        return (
            <div>
                <div className="module-search">
                    <div className="module-search-right" >
                        <Button type="primary"  icon="search"  onClick={this.search.bind(this,{})}>查询</Button>                  
                        <Input placeholder="用户名"   onChange={this.handleSelectChange.bind(that,"name")}/>                        
                    </div>
                </div>

                <div className="module-table" >
                    <Table
                        ref="table"
                        columns={columns}
                        dataSource={data}
                        bordered
                        loading={this.state.loading}
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange.bind(this)}/>
                </div>
            </div>
        )
    }
}

