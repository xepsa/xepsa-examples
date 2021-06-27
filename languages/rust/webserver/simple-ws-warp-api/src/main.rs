use std::collections::HashMap;
use std::sync::Arc;

use parking_lot::RwLock;
use serde::{Deserialize, Serialize};
use warp::{http, Filter};

// Main -----------------------------------------------------------------------

#[tokio::main]
async fn main() {
    // GET /hello/warp => 200 OK with body "Hello, warp!"
    // let hello = warp::path!("hello" / String).map(|name| format!("Hello, {}!", name));
    // warp::serve(hello).run(([127, 0, 0, 1], 3030)).await;

    // let store = Store::new();
    // let store_filter = warp::any().map(move || store.clone());
    // let add_items = warp::post()
    //     .and(warp::path("v1"))
    //     .and(warp::path("store"))
    //     .and(warp::path::end())
    //     .and(json_body())
    //     .and(store_filter.clone())
    //     .and_then(add_store_item);
    // warp::serve(add_items).run(([127, 0, 0, 1], 8080)).await;

    let store = Store::new();
    let store_filter = warp::any().map(move || store.clone());

    let add_items = warp::post()
        .and(warp::path("v1"))
        .and(warp::path("store"))
        .and(warp::path::end())
        .and(post_json())
        .and(store_filter.clone())
        .and_then(add_store_item);

    let list_items = warp::get()
        .and(warp::path("v1"))
        .and(warp::path("store"))
        .and(warp::path::end())
        .and(store_filter.clone())
        .and_then(list_store_items);

    let delete_item = warp::delete()
        .and(warp::path("v1"))
        .and(warp::path("store"))
        .and(warp::path::end())
        .and(delete_json())
        .and(store_filter.clone())
        .and_then(delete_store_item);

    let update_item = warp::put()
        .and(warp::path("v1"))
        .and(warp::path("store"))
        .and(warp::path::end())
        .and(put_json())
        .and(store_filter.clone())
        .and_then(update_store_item);

    let routes = add_items.or(list_items).or(delete_item).or(update_item);

    warp::serve(routes).run(([127, 0, 0, 1], 1337)).await;
}

// State ----------------------------------------------------------------------

// Items - Resource Definition
//
type Items = HashMap<String, i32>;

// Item - Resource Definition
//
#[derive(Debug, Deserialize, Serialize, Clone)]
// #[derive(Debug, Clone)]
struct Item {
    name: String,
    quantity: i32,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
struct Id {
    name: String,
}

// Store - Manage multi-threaded access to global memory state.
//
#[derive(Clone)]
struct Store {
    item_list: Arc<RwLock<Items>>,
}
impl Store {
    fn new() -> Self {
        Store {
            item_list: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

// Endpoint Implementations ---------------------------------------------------

// POST Create Resource Method
async fn add_store_item(item: Item, store: Store) -> Result<impl warp::Reply, warp::Rejection> {
    store.item_list.write().insert(item.name, item.quantity);

    Ok(warp::reply::with_status(
        "Added item to KV store",
        http::StatusCode::CREATED,
    ))
}

// GET Read Resource Method
async fn list_store_items(store: Store) -> Result<impl warp::Reply, warp::Rejection> {
    let mut result = HashMap::new();
    let r = store.item_list.read();

    for (key, value) in r.iter() {
        result.insert(key, value);
    }

    Ok(warp::reply::json(&result))
}

async fn update_store_item(item: Item, store: Store) -> Result<impl warp::Reply, warp::Rejection> {
    store.item_list.write().insert(item.name, item.quantity);

    Ok(warp::reply::with_status(
        "Updated item in KV store",
        http::StatusCode::CREATED,
    ))
}

// DELETE Delete Resource Method
async fn delete_store_item(id: Id, store: Store) -> Result<impl warp::Reply, warp::Rejection> {
    store.item_list.write().remove(&id.name);

    Ok(warp::reply::with_status(
        "Removed item from KV store",
        http::StatusCode::OK,
    ))
}

// Support Functions ------------------------------------------------------------------------------

fn post_json() -> impl Filter<Extract = (Item,), Error = warp::Rejection> + Clone {
    // When accepting a body, we want a JSON body (and to reject huge payloads)...
    warp::body::content_length_limit(1024 * 16).and(warp::body::json())
}

fn put_json() -> impl Filter<Extract = (Item,), Error = warp::Rejection> + Clone {
    // When accepting a body, we want a JSON body (and to reject huge payloads)...
    warp::body::content_length_limit(1024 * 16).and(warp::body::json())
}

fn delete_json() -> impl Filter<Extract = (Id,), Error = warp::Rejection> + Clone {
    // When accepting a body, we want a JSON body (and to reject huge payloads)...
    warp::body::content_length_limit(1024 * 16).and(warp::body::json())
}
