exports.Coin=function(exchange,globalRank,name,diff,exLastPrice,globalLastPrice,globalPriceChange,exHighPrice,exLowPrice,exChange,exVol,exLink,globalLink)
    {
        exchange=exchange;
        globalRank=globalRank;
        name=name;
        diff=diff;
        exLastPrice=exLastPrice;
        globalLastPrice=globalLastPrice;
        globalPriceChange=globalPriceChange
        exChange=exChange;
        exVol=exVol;
        exHighPrice=exHighPrice;
        exLowPrice=exLowPrice;
        exLink=exLink;
        globalLink=globalLink;

        this.setExLink=function(exLinkdata)
        {
            exLink=exLinkdata;
        }
        this.getExLink=function()
        {
            return exLink;
        }

        this.setGlobalLink=function(globalLinkdata)
        {
            globalLink=globalLinkdata;
        }
        this.getGlobalLink=function()
        {
            return globalLink;
        }

        this.setExchange=function(globalLinkdata)
        {
            exchange=globalLinkdata;
        }
        this.getExchange=function()
        {
            return exchange;
        }

        this.setLastGlobprice=function(lastGlobpricedata)
        {
            globalLastPrice=lastGlobpricedata;
        }
        this.getLastGlobprice=function()
        {
            return globalLastPrice;
        }

        this.setGlobPriceChange=function(globPriceChangedata)
        {
            globalPriceChange=globPriceChangedata;
        }
        this.getGlobPriceChange=function()
        {
            return globalPriceChange;
        }

        this.setEXhightprice=function(EXhightpricedata)
        {
            exHighPrice=EXhightpricedata;
        }
        this.getEXhightprice=function()
        {
            return exHighPrice;
        }

        this.setEXlowprice=function(EXlowpricedata)
        {
            exLowPrice=EXlowpricedata;
        }
        this.getEXlowprice=function()
        {
            return exLowPrice;
        }

        this.setGlobalRank=function(rankdata)
        {
            globalRank=rankdata;
        }
        this.getGlobalRank=function()
        {
            return globalRank;
        }

        this.setName=function(namedata)
        {
            name=namedata;
        }
        this.getName=function()
        {
            return name;
        }

        this.setDiff=function(diffdata)
        {
            diff=diffdata;
        }
        this.getDiff=function()
        {
            return diff;
        }

        this.setEXLastprice=function(exLastPricedata)
        {
            exLastPrice=exLastPricedata;
        }
        this.getEXLastprice=function()
        {
            return exLastPrice;
        }

        this.setChange=function(changedata)
        {
            exChange=changedata;
        }
        this.getChange=function()
        {
            return exChange;
        }
       
        this.setEXVol=function(exVoldata)
        {
            exVol=exVoldata;
        }
        this.getEXVol=function()
        {
            return exVol;
        }
};
