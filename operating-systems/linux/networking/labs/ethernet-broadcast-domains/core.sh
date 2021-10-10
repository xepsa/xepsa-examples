#!/bin/bash

create_bridge() {
    local nsname="$1"
    local ifname="$2"

    echo "Creating bridge ${nsname}/${ifname}"

    ip netns add ${nsname}
    ip netns exec ${nsname} ip link set lo up
    ip netns exec ${nsname} ip link add ${ifname} type bridge
    ip netns exec ${nsname} ip link set ${ifname} up
}

create_host() {
    local host_nsname="$1"
    local peer1_ifname="$2a"
    local peer2_ifname="$2b"
    local bridge_nsname="$3"
    local bridge_ifname="$4"

    echo "Creating end host ${host_nsname} connected to ${bridge_nsname}/${bridge_ifname} bridge"

    # Create end host network namespace.
    ip netns add ${host_nsname}
    ip netns exec ${host_nsname} ip link set lo up

    # Create a veth pair connecting end host and bridge namespaces.
    ip link add ${peer1_ifname} netns ${host_nsname} type veth peer \
                ${peer2_ifname} netns ${bridge_nsname}
    ip netns exec ${host_nsname} ip link set ${peer1_ifname} up
    ip netns exec ${bridge_nsname} ip link set ${peer2_ifname} up

    # Attach peer2 interface to the bridge.
    ip netns exec ${bridge_nsname} ip link set ${peer2_ifname} master ${bridge_ifname}
}

connect_bridges() {
    local bridge1_nsname="$1"
    local bridge1_ifname="$2"
    local bridge2_nsname="$3"
    local bridge2_ifname="$4"
    local peer1_ifname="veth_${bridge2_ifname}"
    local peer2_ifname="veth_${bridge1_ifname}"

    echo "Connecting bridge ${bridge1_nsname}/${bridge1_ifname} to ${bridge2_nsname}/${bridge2_ifname} bridge using veth pair"

    # Create veth pair.
    ip link add ${peer1_ifname} netns ${bridge1_nsname} type veth peer \
                ${peer2_ifname} netns ${bridge2_nsname}
    ip netns exec ${bridge1_nsname} ip link set ${peer1_ifname} up
    ip netns exec ${bridge2_nsname} ip link set ${peer2_ifname} up

    # Connect bridges.
    ip netns exec ${bridge1_nsname} ip link set ${peer1_ifname} master ${bridge1_ifname}
    ip netns exec ${bridge2_nsname} ip link set ${peer2_ifname} master ${bridge2_ifname}
}