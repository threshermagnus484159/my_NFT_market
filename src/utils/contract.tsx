import { Yuan_coin_addr,Yuan_nft_addr,Yuan_market_addr } from '@/contracts/address';
import  abis from '@/contracts/abis';

function ERC20contract(functionName: string, args ?: any[] ) {
    return {
      address: Yuan_coin_addr,
      abi: abis.Yuan_coin_Abi,
      functionName,
      args,
    }as any;
}
function ERC721contract(functionName:string,args?:any[]){
    return {
        address:Yuan_nft_addr,
        abi:abis.Yuan_nft_Abi,
        functionName,
        args
    } as any;
}

function MARKETcontract(functionName:string,args?:any[]){
    return {
        address:Yuan_market_addr,
        abi:abis.Yuan_market_Abi,
        functionName,
        args
    } as any;
}

export {ERC20contract,ERC721contract,MARKETcontract}