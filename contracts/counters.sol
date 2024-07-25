// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Counters.sol)

pragma solidity ^0.8.0;

/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 */
library Counters {
    struct Counter {
        uint256 _value; // default: 0
    }

    /**
     * @dev Returns the current value of the counter. Note that the underlying `_value` variable is public, but
     * accessing it directly can be more costly than calling this getter function.
     */
    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    /**
     * @dev Increments the value of the counter by 1. This function uses unchecked addition, which is cheaper
     * but does not check for overflow. It is the caller's responsibility to ensure that overflows are not possible.
     */
    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    /**
     * @dev Decrements the value of the counter by 1. This function uses unchecked subtraction, which is cheaper
     * but does not check for underflow. It is the caller's responsibility to ensure that underflows are not possible.
     */
    function decrement(Counter storage counter) internal {
        unchecked {
            counter._value -= 1;
        }
    }

    /**
     * @dev Resets the value of the counter to 0.
     */
    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}
