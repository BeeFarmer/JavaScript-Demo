/**
 * #15 - 3Sum
 * @param {number[]} nums
 * @return {number[][]}
 */
let threeSum = function(nums) {
    
    nums.sort((a, b) => a - b);
    const res = [];
    
    for (let i = 0; i < nums.length-2; ++i) {
        if (i !== 0 && nums[i] === nums[i-1] || nums[i] > 0) {
            continue;
        }
        
        let l = i + 1;
        let r = nums.length - 1;
        while (l < r) {
            if (nums[i] + nums[l] + nums[r] < 0) {
                ++l;
            } else if (nums[i] + nums[l] + nums[r] > 0) {
                --r;
            } else { // find sum == 0
                res.push([nums[i], nums[l], nums[r]]);
                
                // remove duplicates
                while (l < r && nums[l] === nums[l+1]) { ++l; }
                while (l < r && nums[r] === nums[r-1]) { --r; }
                ++l;
                --r;
            }
        }
    }
    
    return res;
};


/**
 * #46 - Permutations
 * @param {number[]} nums
 * @return {number[][]}
 */
let dfsPermute = (path, nums, res) => {
    if (path.length === nums.length) {
        res.push(path.slice());
        return ;
    }

    for (let i = 0; i < nums.length; ++i) {
        if (!path.includes(nums[i])) {
            path.push(nums[i]);
            dfsPermute(path, nums, res);
            path.pop();
        }
    }
}

let permute = function(nums) {
    const res = [];
    dfsPermute([], nums, res);

    return res;
};


/**
 * $56 - Merge Intervals
 * @param {number[][]} intervals
 * @return {number[][]}
 */
let merge = function(inter) {
    if (!inter.length) { return inter; }
    
    inter.sort((a, b) => (a[0] !== b[0]) ? a[0] - b[0] : a[1] - b[1]);
    let i = 0;
    while (i < inter.length-1) {
        if (inter[i][1] < inter[i+1][0]) {
            ++i;
        } else {
            if (inter[i][1] < inter[i+1][1]) {
                inter[i][1] = inter[i+1][1];
            }
            inter.splice(i+1, 1);
        }
    }
    
    return inter;
};


/**
 * #525 - Contiguous Array
 * @param {number[]} nums
 * @return {number}
 */
let findMaxLength = function(nums) {
    if (!nums.length) { return 0; }
    
    let cur_max = 0;
    let counter = 0;
    const dict = {0: -1};
    
    for (let i = 0; i < nums.length; ++i) {
        counter += (nums[i] === 1) ? 1 : -1;

        if (counter in dict) {
            cur_max = Math.max(cur_max, i - dict[counter]);
        } else {
            dict[counter] = i;
        }
    }
    
    return cur_max;
};


/**
 * #6 - ZigZag Conversion
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
let convert = function(s, numRows) {
    if (s.length <= numRows || numRows === 1) { return s; }
    
    let index = 0;
    let offset = 1;
    const str_list = [];
    for (let i = 0; i < numRows; ++i) {
        str_list.push("");
    }
    
    for (let c of s) {
        if ([-1, numRows].includes(index+offset)) {
            offset = -offset;
        }
        str_list[index] += c;
        index += offset;
    }
    
    return str_list.join("");
};


/**
 * #456 - 132Pattern
 * @param {number[]} nums
 * @return {boolean}
 */
let find132pattern = function(nums) {
    
    const stack = [];
    let pre_max = Number.NEGATIVE_INFINITY;
   
    for (let i = nums.length-1; i > -1; --i) {
        if (nums[i] < pre_max) { // not stack-sortable, contains 231
            return true; 
        }
        
        while (stack.length && stack[stack.length-1] < nums[i]) {
            pre_max = stack.pop();
        }
        stack.push(nums[i]);
    }

    return false;
};