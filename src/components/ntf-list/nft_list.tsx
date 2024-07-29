import { List,message,FloatButton,Modal,Form,Input ,InputNumber} from 'antd';
import { useReadContract ,useWriteContract,useAccount} from 'wagmi';
import { NFTCard,Address } from '@ant-design/web3';
import type { NftItem } from '../../types'
import { Yuan_market_addr,Yuan_nft_addr} from '../../contracts/address';
import  NftCardFooter  from './NftCardFooter';
import { ERC20contract, MARKETcontract,ERC721contract } from '@/utils/contract';
import { MoneyCollectFilled, ToolFilled } from '@ant-design/icons';
import { useState } from 'react';
import { parseUnits } from 'viem'



const DEFAULT_IMAGE = 'https://img.picui.cn/free/2024/07/15/669534c5c107e.jpg';

const Nft_list = () => {

  const [messageApi, contextHolder] = message.useMessage()
  const  account = useAccount()
  const { writeContractAsync } = useWriteContract()
  const result = useReadContract(MARKETcontract('getAll'));
  const nfts = result.data as NftItem[];
  const [form] = Form.useForm()
  const [dialogShown, setDialogShown] = useState(false)






  if (result.isLoading) {
    return <div>Loading...</div>; // 数据加载时显示加载指示
  }

  function resolveActionText(nft: NftItem, account: any): string {
    if (!account) {
      return 'please connect wallet'
    }
    if (nft.seller === account.address) {
      return nft.listing ? 'Unlist' : 'List'
    }
    return nft.listing ? 'Buy' : 'Not for sale'
  }


  const buyNft = (nft: NftItem) => {
    const args = [nft.nftContract, nft.tokenId]

    if (nft.seller === account.address) {
      writeContractAsync(MARKETcontract('unlist', args))
        .then(res => {
          console.log('unlist success: ', res)
          messageApi.success('Unlist success')
        })
        .catch(err => {
          console.log('unlist failed', err.message)
          messageApi.error('Unlist failed')
        })
    } else {
      writeContractAsync(ERC20contract('approve', [Yuan_market_addr, nft.price]))
        .then(res => {
          console.log('approve success', res)
          writeContractAsync(MARKETcontract('buy', args))
            .then(res => {
              console.log('buy success: ', res)
              messageApi.success('Buy success')
            })
            .catch(err => {
              console.log('buy failed', err.message)
              messageApi.error('Buy failed')
            })
        })
        .catch(err => {
          console.log('approve failed', err.message)
          messageApi.error('approve failed')
        })
    }
  }

  
  const mintNFT = () => {

    writeContractAsync(ERC721contract('mint'))
      .then(res => {
        console.log('mint success: ', res)
        messageApi.success('Mint success')
      })
      .catch(err => {
        console.log('mint failed', err.message)
        messageApi.error('Mint failed')
      })
  }


  //打开model
   const handleSell = () => {
      setDialogShown(true)
   }
   //关闭model
   const handleClose = () => {
      form.resetFields()
      setDialogShown(false)
   }

   //提交表单
   const handleSubmit = () => {
    const values = form.getFieldsValue()
    if (values.price === 0) {
      return messageApi.warning('NFT price can not be 0.')
    }

    writeContractAsync(ERC721contract('setApprovalForAll', [Yuan_market_addr, true]))
    .then(() => writeContractAsync(MARKETcontract('sell', [Yuan_nft_addr, values.tokenId, parseUnits(`${values.price}`, 2), values.url]))
        .then(res => {
          console.log('sell success: ', res)
          messageApi.success('Sell success')
          handleClose()
        }).catch(err => {
          console.log('sell failed', err.message)
          messageApi.error('Sell failed')
        })
    ).catch(err => {
      console.log('sell failed', err.message)
      messageApi.error('Sell failed')
    })
      
    
   }


  return (
    <>
      {contextHolder}
       <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4 }}
        dataSource={nfts}
        renderItem={nft => (
          <List.Item>
            <NFTCard
              key={`${nft.nftContract}#${nft.tokenId}`}
              tokenId={nft.tokenId}
              price={{ value: nft.price, decimals: 2, symbol: 'Yuan' }}
              image={nft.tokenUrl || DEFAULT_IMAGE}
              showAction
              actionText={resolveActionText(nft, account)}
              onActionClick={() => buyNft(nft)}
              footer={<NftCardFooter dataSource={nft} />}
            />
          </List.Item>
        )}

        
      />
        <FloatButton
          icon={<ToolFilled />}
          description="Mint NFT"
          shape="square"
          style={{ right: 200 }}
          onClick={mintNFT}
          type='primary'
          

        /> 
        <FloatButton
          icon={<MoneyCollectFilled  />}
          description="List NFT"
          shape="square"
          style={{ right: 150 }}
          onClick={handleSell}
          type='primary'
        />


      <Modal title="Sell new NFT" open={dialogShown} onOk={() => form.submit()} onCancel={handleClose}>
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={handleSubmit}>
          <Form.Item label="Contract">
            <Address address={Yuan_nft_addr} ellipsis={{ headClip: 8, tailClip: 6 }} copyable />
          </Form.Item>
          <Form.Item label="Token ID" name="tokenId" rules={[{ required: true, message: 'Please input NFT token ID!' }]}>
            <InputNumber min={1} precision={0} addonBefore="#" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input NFT price!' }]}>
            <InputNumber min={0} addonAfter="Yuan" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="URL" name="url" rules={[{ required: true, message: 'Please input NFT URL!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>



    
  );
};

export default Nft_list;