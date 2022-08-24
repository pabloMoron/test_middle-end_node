"use strict"

import Axios from "axios"
import { DATA_SOURCES, Source } from "../../middlewares/passport"
import * as error from "../../server/error"
import { IItemDescription } from "./items"
import { result } from "./result"

export async function findItemDescriptionById(
  source: Source,
  id: string
): Promise<IItemDescription> {
  validateDescriptionRequest(id)
  let strateggy = new DescriptionStrategyFactory().getStrategy(source)
  const description = strateggy.findDescription(id)
  return description
}

function validateDescriptionRequest(id: string): void {
  const result = new error.ValidationErrorMessage()
  result.messages = []

  //id validation
  const regex = new RegExp("[^A-Za-z0-9]")
  if (!id || id.length <= 0) {
    result.messages.push({
      path: "id",
      message: "cannot be null",
    })
  }

  if (regex.test(id)) {
    result.messages.push({
      path: "id",
      message: "numbers and letters only",
    })
  }

  if (result.messages.length > 0) {
    throw result
  }
}

//#region Implementar patron Factory y Strategy
interface IDescriptionStrategy {
  findDescription(id: string): Promise<IItemDescription>
}

class DescriptionStrategyFactory {
  getStrategy(source: Source): IDescriptionStrategy {
    if (source.data_source == DATA_SOURCES.API) {
      return new MLDescriptionStrategy()
    }
    if (source.data_source == DATA_SOURCES.MOCK) {
      return new MockDescriptionStrategy()
    }
    const noStrategy = {
      status: 500,
      message: "No strategy",
    }

    throw noStrategy
  }
}

class MockDescriptionStrategy implements IDescriptionStrategy {
  async findDescription(id: string): Promise<IItemDescription> {
    return result
  }
}

class MLDescriptionStrategy implements IDescriptionStrategy {
  async findDescription(id: string): Promise<IItemDescription> {
    let item_res = (
      await Axios.get(`https://api.mercadolibre.com/items/${id}/`)
    ).data
    let desc_res = (
      await Axios.get(`https://api.mercadolibre.com/items/${id}/description`)
    ).data
    let result: IItemDescription = {
      author: {
        lastname: "Moron",
        name: "Pablo Gabriel",
      },
      item: {
        id: item_res.id,
        title: item_res.title,
        description: desc_res.plain_text,
        condition: item_res.condition,
        picture: item_res.pictures[0].secure_url || "",
        free_shipping: item_res.shipping.free_shipping,
        price: {
          amount: item_res.base_price,
          currency: item_res.currency_id,
          decimals: 2, // Que quiere decir? los decimales de la moneda o del precio
        },
        sold_quantity: item_res.sold_quantity,
      },
    }
    return result
  }
}
//#endregion Implementar patron Factory y Strategy
