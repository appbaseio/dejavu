//! © 2015 Nathan Rugg <nmrugg@gmail.com> | MIT
/// See LICENSE for more details.

// jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, nonew:true, onevar:true, plusplus:true, quotmark:double, undef:true, unused:strict, browser: true, node: true

/// Does the environment support web workers?  If not, let's load the worker manually (without polluting the global scope).
if (typeof Worker === "undefined" || (typeof location !== "undefined" && location.protocol === "file:")) {
    /// Is this Node.js?
    if (typeof global !== "undefined" && typeof require !== "undefined") {
        this.LZMA = function (lzma_path) {
            return require(lzma_path || "./lzma_worker.js").LZMA;
        };
    /// Is this a browser?
    } else if (typeof window !== "undefined" && window.document) {
        (function () {
            var that = this,
                global_var,
                req = function req(path) {
                    var script_tag  = document.createElement("script");
                    script_tag.type ="text/javascript";
                    script_tag.src  = path;
                    script_tag.onload = function () {
                        /// Make sure this LZMA variable doesn't get overwritten by the worker's.
                        that.LZMA = non_worker_lzma;
                    };
                    document.getElementsByTagName("head")[0].appendChild(script_tag);
                };
            
            /// Determine the global variable (it's called "window" in browsers, "global" in Node.js).
            if (typeof window !== "undefined") {
                global_var = window;
            } else if (global) {
                global_var = global;
            }
            
            function non_worker_lzma(path) {
                var fake_lzma;
                
                req(path);
                
                fake_lzma = {
                    compress: function compress(mixed, mode, on_finish, on_progress) {
                        if (global_var.LZMA_WORKER) {
                            global_var.LZMA_WORKER.compress(mixed, mode, on_finish, on_progress);
                        } else {
                            /// Wait
                            setTimeout(function ()
                            {
                                fake_lzma.compress(mixed, mode, on_finish, on_progress);
                            }, 50);
                        }
                    },
                    decompress: function decompress(byte_arr, on_finish, on_progress) {
                        if (global_var.LZMA_WORKER) {
                            global_var.LZMA_WORKER.decompress(byte_arr, on_finish, on_progress);
                        } else {
                            /// Wait
                            setTimeout(function ()
                            {
                                fake_lzma.decompress(byte_arr, on_finish, on_progress);
                            }, 50);
                        }
                    },
                    worker: function worker () {
                        return null;
                    }
                };
                
                return fake_lzma;
            }
            
            that.LZMA = non_worker_lzma;
        }());
    } else {
        /// It doesn't seem to be either Node.js or a browser.
        console.error("Can't load the worker. Sorry.");
    }
} else {
    /// Let's use Web Workers.
    ///NOTE: The "this" keyword is the global context ("window" variable) if loaded via a <script> tag
    ///      or the function context if loaded as a module (e.g., in Node.js).
    this.LZMA = function (lzma_path) {
        var action_compress   = 1,
            action_decompress = 2,
            action_progress   = 3,
            
            callback_obj = {},
            
            ///NOTE: Node.js needs something like "./" or "../" at the beginning.
            lzma_worker = new Worker(lzma_path || "./lzma_worker-min.js");
        
        lzma_worker.onmessage = function onmessage(e) {
            if (e.data.action === action_progress) {
                if (callback_obj[e.data.cbn] && typeof callback_obj[e.data.cbn].on_progress === "function") {
                    callback_obj[e.data.cbn].on_progress(e.data.result);
                }
            } else {
                if (callback_obj[e.data.cbn] && typeof callback_obj[e.data.cbn].on_finish === "function") {
                    callback_obj[e.data.cbn].on_finish(e.data.result, e.data.error);
                    
                    /// Since the (de)compression is complete, the callbacks are no longer needed.
                    delete callback_obj[e.data.cbn];
                }
            }
        };
        
        /// Very simple error handling.
        lzma_worker.onerror = function(event) {
            var err = new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
            
            for (var cbn in callback_obj) {
                callback_obj[cbn].on_finish(null, err);
            }
            
            console.error('Uncaught error in lzma_worker', err);
        };
        
        return (function () {
            
            function send_to_worker(action, data, mode, on_finish, on_progress) {
                var cbn;
                
                do {
                    cbn = Math.floor(Math.random() * (10000000));
                } while(typeof callback_obj[cbn] !== "undefined");
                
                callback_obj[cbn] = {
                    on_finish:   on_finish,
                    on_progress: on_progress
                };
                
                lzma_worker.postMessage({
                    action: action, /// action_compress = 1, action_decompress = 2, action_progress = 3
                    cbn:    cbn,    /// callback number
                    data:   data,
                    mode:   mode
                });
            }
            
            return {
                compress: function compress(mixed, mode, on_finish, on_progress) {
                    send_to_worker(action_compress, mixed, mode, on_finish, on_progress);
                },
                decompress: function decompress(byte_arr, on_finish, on_progress) {
                    send_to_worker(action_decompress, byte_arr, false, on_finish, on_progress);
                },
                worker: function worker() {
                    return lzma_worker;
                }
            };
        }());
    };
}
