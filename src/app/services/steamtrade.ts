import TradeOfferManager from 'steam-tradeoffer-manager'
import TradeOffer from 'steam-tradeoffer-manager/lib/classes/TradeOffer'
import SteamUser from "steam-user"
import SteamTotp from "steam-totp"
import SteamCommunity from "steamcommunity"

const steamUsername: any = process.env.STEAM_BOT_USERNAME
const steamPassword: any = process.env.STEAM_BOT_PASSWORD
const steamGuard: any = process.env.STEAM_BOT_GUARD

const SteamID = TradeOfferManager.SteamID
let testPartner = new SteamID("[U:1:440715549]")
let testToken = "mB8IC961"

const client = new SteamUser()
const manager = new TradeOfferManager({
	"steam": client,
	"domain": "http://localhost:3000",
	"language": "en"
})
const community = new SteamCommunity()

let logOnOptions = {
	"accountName": steamUsername,
	"password": steamPassword,
	"twoFactorCode": SteamTotp.getAuthCode(steamGuard)
}

export function getSteamIdAndToken(steamId: string, tradeOfferLink: string) {
    const token = tradeOfferLink.split("=")[2]
    //convert original steamid to steamid3
    const partnerSteamId3 = tradeOfferLink.split("=")[1].split("&")[0]
    const tokenAndSteamObject = {
        token: token,
        steamId3: partnerSteamId3
    }
    return tokenAndSteamObject
}

function addMyItemByName(itemName: string, manager: any) {
            //we'd later switch 730 and 2 to Deadlock's numbers
            manager.getUserInventoryContents(730, 2, true, () => (err:any, items:any) => {
                if (err) {
                    console.error("Error fetching inventory: ", err)
                    return false
                }
                if (items.length == 0) {
                    // Inventory empty
                    console.log("CS:GO inventory is empty")
                    return false
                }
                // Find the item by name
                const item = items.find((i: any) => i.name === itemName);
                
                if (item) {
                    //const result = manager.addMyItem(item);
                    return item
                } else {
                    return false // Item not found
                }
            });
    }

async function fetchTargetItems(steamId: string) {
    const response = await fetch(`https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=5000`)
    const json = await response.json()
    return json
}

export function getInventory() {

}

export async function addAndSendTradeBot(itemStringList: any, steamId: string, token: string, transactionId: string) {
    //first log in
    client.logOn(logOnOptions)
    client.on('loggedOn', function() {
        console.log("Logged into Steam");
    })
    const fetchedItems = await fetchTargetItems(steamId)
    const getItems: any = addMyItemByName(itemStringList, manager) //this gets the select items
    if (getItems == false) {
        return
    }
    //check if items exist in steam inventory
    manager.getInventoryContents(730, 2, true, () => (err: any, inventory: any) => {
        if (err) {
            console.log(err)
            return
        }

        if (inventory.length == 0) {
            // Inventory empty
            console.log("CS:GO inventory is empty")
            return
        }
        if (itemStringList.every((e:string) => fetchedItems.includes(e))) {
            //then send trade
            let createdOffer = manager.createOffer(`https://steamcommunity.com/tradeoffer/new/?partner=${steamId}&token=${token}`)
            createdOffer.addMyItems(getItems)
            createdOffer.setMessage(`Transaction ID: ${transactionId}`)
            createdOffer.send(() => (error: any, status: any) => {
                if (error) {
                    console.log(error)
                    return
                }
                if (status === "pending") {
                    console.log("Offer sent, requires confirmation.")
                    community.acceptConfirmationForObject("identitySecret", createdOffer.id, () => (error:any) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log("Offer confirmed")
                        }
                    })
                } else {
                    console.log("Offer succesfully sent.")
                }
            })
            return fetchedItems
        } else {
        throw new Error("Some items don't exist.")
        }
    })
}

