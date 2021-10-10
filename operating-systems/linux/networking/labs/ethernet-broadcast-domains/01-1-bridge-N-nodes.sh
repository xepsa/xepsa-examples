#!/usr/bin/env bash

source core.sh

create_bridge netns_br0 br0
create_end_host netns_veth0 veth0 netns_br0 br0
create_end_host netns_veth1 veth1 netns_br0 br0
create_end_host netns_veth2 veth2 netns_br0 br0